import CurriculumSection from '../CurriculumSection';

export default function CurriculumSectionExample() {
  return <CurriculumSection onDownloadCurriculum={() => console.log('Download curriculum clicked')} />;
}
