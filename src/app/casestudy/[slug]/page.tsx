import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyDetail from "@/components/casestudy/CaseStudyDetail";
import { caseStudies, getCaseStudy } from "@/lib/caseStudies";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.detail.title} | KindCodex Case Study`,
    description: study.summary,
    // Hidden extras stay out of search engines — reachable only by direct link.
    ...(study.hidden ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return <CaseStudyDetail study={study} />;
}
