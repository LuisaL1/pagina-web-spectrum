import Link from "next/link";
import { getSolutions } from "@/data/solutions-data";
import { localizedHref } from "@/lib/i18n";

const labels = { es: "Unidades de negocio", en: "Business units" };

export default function UnitNav({ locale = "es" }) {
  const solutions = getSolutions(locale);

  return (
    <nav className="unit-nav" aria-label={labels[locale] || labels.es}>
      <ul className="wrap unit-nav-list">
        {solutions.map((item) => (
          <li key={item.slug}>
            <Link href={localizedHref(locale, `/soluciones/${item.slug}`)}>
              <span className="unit-nav-num">{item.icon}</span>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
