import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acerca de | iFindItForYou",
  description:
    "Información sobre iFindItForYou, el asistente que combina búsqueda humana e IA para encontrar lo que necesitas.",
};

export default function AboutPageEs() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Acerca de iFindItForYou</h1>

      <section className="space-y-6 text-sm leading-relaxed text-slate-800">
        <p>
          <strong>iFindItForYou</strong> nació de una idea sencilla: muchas
          personas pierden tiempo buscando productos, servicios o información
          específica, y los resultados de los buscadores tradicionales pueden
          ser demasiado amplios o confusos.
        </p>

        <p>
          El objetivo del servicio es combinar{" "}
          <strong>búsqueda humana</strong> y <strong>tecnologías de IA</strong>{" "}
          para ofrecer pocas opciones bien filtradas, en lugar de miles de
          resultados genéricos.
        </p>

        <p>
          La versión actual del producto está pensada para usuarios que desean:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>ahorrar tiempo en búsquedas complejas;</li>
          <li>
            recibir sugerencias ya filtradas según criterios de precio, país,
            tipo de producto, etc.;
          </li>
          <li>
            poder pasar a un <strong>plan PRO</strong> cuando utilizan el
            servicio de forma intensiva.
          </li>
        </ul>

        <p>
          El proyecto está en evolución continua. En las próximas versiones se
          añadirán nuevas funciones para gestionar mejor el historial de
          búsquedas, las preferencias personales y la colaboración con
          asistentes humanos.
        </p>
      </section>
    </main>
  );
}
