// app/es/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | iFindItForYou",
  description:
    "Lee los términos y condiciones de uso del servicio iFindItForYou.",
};

export default function TermsPageEs() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>

      <p className="mb-4 text-sm text-slate-600">
        Última actualización: <strong>3 de noviembre de 2025</strong>
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-slate-800">
        <p>
          Bienvenido a <strong>iFindItForYou</strong>. Al utilizar este sitio
          web y sus servicios asociados, aceptas los presentes Términos y
          Condiciones. Te recomendamos leerlos con atención antes de usar la
          plataforma.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          1. Objeto del servicio
        </h2>
        <p>
          iFindItForYou ofrece un servicio de búsqueda asistida que combina
          herramientas de inteligencia artificial y, cuando es necesario,
          revisión humana para proporcionar resultados filtrados y resumidos
          según tu solicitud.
        </p>

        <h2 className="text-xl font-semibold mt-6">2. Uso permitido</h2>
        <p>
          Puedes utilizar el servicio únicamente con fines lícitos y personales.
          Está prohibido utilizar iFindItForYou para actividades ilegales,
          engañosas o perjudiciales, o de forma que pueda dañar a terceros o al
          propio servicio.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          3. Plan gratuito y plan PRO
        </h2>
        <p>
          El plan <strong>gratuito</strong> ofrece un número limitado de
          búsquedas sin coste. El plan <strong>PRO</strong> es una suscripción
          que permite un uso más amplio del servicio, según se indica en la
          página de precios. Los precios pueden cambiar con el tiempo; en caso
          de cambios relevantes, te informaremos adecuadamente.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          4. Pagos y facturación
        </h2>
        <p>
          Los pagos del plan PRO se gestionan a través de Stripe. iFindItForYou
          no almacena los datos de pago; estos son tratados por el proveedor de
          pagos. La suscripción se renueva automáticamente en cada periodo de
          facturación hasta que se cancele.
        </p>

        <h2 className="text-xl font-semibold mt-6">5. Sin asesoramiento</h2>
        <p>
          La información proporcionada por el servicio tiene carácter meramente
          informativo. iFindItForYou no ofrece asesoramiento legal, médico,
          financiero ni profesional. Te recomendamos verificar toda información
          crítica con fuentes oficiales o profesionales cualificados.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          6. Limitación de responsabilidad
        </h2>
        <p>
          Aunque nos esforzamos por ofrecer resultados de calidad, no podemos
          garantizar la exactitud, integridad o actualización de toda la
          información. iFindItForYou no será responsable de daños directos o
          indirectos derivados del uso del servicio.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          7. Modificaciones de los términos
        </h2>
        <p>
          Podemos actualizar estos Términos y Condiciones en cualquier momento.
          En caso de cambios significativos, te informaremos a través del sitio
          web o por correo electrónico. Al seguir utilizando el servicio después
          de dichas modificaciones, aceptas los términos actualizados.
        </p>

        <h2 className="text-xl font-semibold mt-6">8. Contacto</h2>
        <p>
          Si tienes preguntas sobre estos Términos y Condiciones, puedes
          contactarnos mediante la dirección de correo electrónico indicada en
          la página de contacto.
        </p>
      </section>

      <div className="mt-10 text-xs text-slate-500 border-t border-slate-200 pt-4">
        © {new Date().getFullYear()} iFindItForYou. Todos los derechos
        reservados.
      </div>
    </main>
  );
}
