import type { Express, RequestHandler, Request, Response, NextFunction } from "express";
import session from "express-session";
import { supabaseAdmin } from "./supabaseClient";

const SESSION_COOKIE_NAME = 'sb_access_token';

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const isProduction = process.env.NODE_ENV === "production";
  
  return session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "lax" : "lax",
      maxAge: sessionTtl,
    },
  });
}

export async function setupSupabaseAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  app.post("/api/auth/session", async (req: Request, res: Response) => {
    try {
      const { access_token, refresh_token } = req.body;
      
      if (!access_token) {
        return res.status(400).json({ error: "Missing access_token" });
      }

      const { data: { user }, error } = await supabaseAdmin.auth.getUser(access_token);
      
      if (error || !user) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const profile = await ensureProfile(user);

      (req.session as any).accessToken = access_token;
      (req.session as any).refreshToken = refresh_token;
      (req.session as any).userId = user.id;

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          ...profile
        }
      });
    } catch (error) {
      console.error("Session creation error:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  app.get("/api/auth/user", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const user = (req as any).user;
      
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        const fallbackProfile = await ensureProfile(user);
        if (fallbackProfile) {
          return res.json({
            id: userId,
            ...fallbackProfile
          });
        }
        return res.status(500).json({ error: "Failed to fetch user profile" });
      }

      res.json({
        id: userId,
        ...profile
      });
    } catch (error) {
      console.error("Error in /api/auth/user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/me", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const user = (req as any).user;
      
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile in /api/me:", error);
        const fallbackProfile = await ensureProfile(user);
        if (fallbackProfile) {
          return res.json({
            user: { id: userId },
            profile: fallbackProfile
          });
        }
        return res.status(500).json({ error: "Failed to fetch profile" });
      }

      res.json({
        user: { id: userId },
        profile
      });
    } catch (error) {
      console.error("Error in /api/me:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
}

async function ensureProfile(user: any) {
  try {
    const { data: existingProfile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return existingProfile;
    }

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching profile:", fetchError);
    }

    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const { data: newProfile, error } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        first_name: firstName,
        last_name: lastName,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        onboarding_status: 'not_started'
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating profile:", error);
      return {
        id: user.id,
        email: user.email,
        first_name: firstName,
        last_name: lastName,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        onboarding_status: 'not_started',
        _temporary: true
      };
    }

    return newProfile;
  } catch (err) {
    console.error("ensureProfile exception:", err);
    return {
      id: user.id,
      email: user.email,
      onboarding_status: 'not_started',
      _temporary: true
    };
  }
}

export const optionalAuth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = (req.session as any)?.accessToken;
    
    if (!accessToken) {
      (req as any).userId = null;
      (req as any).user = null;
      return next();
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      (req as any).userId = null;
      (req as any).user = null;
      return next();
    }

    (req as any).userId = user.id;
    (req as any).user = user;
    
    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    (req as any).userId = null;
    (req as any).user = null;
    next();
  }
};

export const isAuthenticated: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = (req.session as any)?.accessToken;
    const refreshToken = (req.session as any)?.refreshToken;
    
    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      if (refreshToken) {
        const refreshResult = await supabaseAdmin.auth.refreshSession({ refresh_token: refreshToken });
        
        if (refreshResult.data.session && refreshResult.data.user) {
          (req.session as any).accessToken = refreshResult.data.session.access_token;
          (req.session as any).refreshToken = refreshResult.data.session.refresh_token;
          user = refreshResult.data.user;
        } else {
          req.session.destroy(() => {});
          return res.status(401).json({ error: "Session expired. Please sign in again." });
        }
      } else {
        req.session.destroy(() => {});
        return res.status(401).json({ error: "Unauthorized" });
      }
    }

    (req as any).userId = user.id;
    (req as any).user = user;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    req.session.destroy(() => {});
    res.status(401).json({ error: "Unauthorized" });
  }
};
