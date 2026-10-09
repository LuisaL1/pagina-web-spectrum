import Header from "@/components/layout/Header";
import DataPolicy from "@/components/sections/DataPolicy";
import Footer from "@/components/layout/Footer";
import { buildAlternates, buildOpenGraph, pageTitle } from "@/lib/seo";

const title = pageTitle("Personal Data Processing Policy");
const description =
  "Spectrum Technology S.A.S's Personal Data Processing Policy, in accordance with Colombian Law 1581 of 2012 and Decree 1377 of 2013.";

export const metadata = {
  title,
  description,
  alternates: buildAlternates("en", "/politica-de-datos"),
  ...buildOpenGraph({ title, description, locale: "en", path: "/politica-de-datos" }),
};

export default function PoliticaDeDatosPageEn() {
  return (
    <>
      <Header locale="en" />
      <main id="main-content">
        <DataPolicy locale="en" />
      </main>
      <Footer locale="en" />
    </>
  );
}
