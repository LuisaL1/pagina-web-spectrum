import Header from "@/components/layout/Header";
import DataPolicy from "@/components/sections/DataPolicy";
import Footer from "@/components/layout/Footer";
import { buildAlternates, buildOpenGraph, pageTitle } from "@/lib/seo";

const title = pageTitle("Política de Tratamiento de Datos Personales");
const description =
  "Política de Tratamiento de Datos Personales de Spectrum Technology S.A.S, conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.";

export const metadata = {
  title,
  description,
  alternates: buildAlternates("es", "/politica-de-datos"),
  ...buildOpenGraph({ title, description, locale: "es", path: "/politica-de-datos" }),
};

export default function PoliticaDeDatosPage() {
  return (
    <>
      <Header locale="es" />
      <main id="main-content">
        <DataPolicy locale="es" />
      </main>
      <Footer locale="es" />
    </>
  );
}
