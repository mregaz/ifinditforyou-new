import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad | iFindItForYou",
  description:
    "Información sobre cómo iFindItForYou trata los datos personales y las búsquedas de los usuarios.",
};

export default function PrivacyPageEs() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Política de privacidad</h1>

      <p className="mb-4 text-sm text-slate-600">
        Última actualización: <strong>3 de noviembre de 2025</strong>
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-slate-800">
        <p>
          En esta página explicamos cómo <strong>iFindItForYou</strong> recoge y
          utiliza los datos personales de los usuarios que utilizan el servicio.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          1. Responsable del tratamiento
        </h2>
        <p>
          El responsable del tratamiento es el operador del servicio
          iFindItForYou. Los datos de contacto figuran en la página de contacto
          del sitio web.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          2. Tipos de datos tratados
        </h2>
        <p>
          Al utilizar el servicio, podemos tratar las siguientes categorías de
          datos:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>datos identificativos básicos (por ejemplo, correo electrónico);</li>
          <li>
            contenido de las solicitudes que escribes en el campo de búsqueda;
          </li>
          <li>
            datos técnicos de navegación (dirección IP, tipo de navegador,
            registros de uso) recogidos de forma automática.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          3. Finalidades del tratamiento
        </h2>
        <p>Los datos se tratan con las siguientes finalidades:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>prestar el servicio de búsqueda solicitado por el usuario;</li>
          <li>
            gestionar cuentas, planes Free y PRO y la facturación a través de
            Stripe;
          </li>
          <li>
            mejorar el servicio y analizar su uso de forma agregada;
          </li>
          <li>
            cumplir con las obligaciones legales y responder a solicitudes de
            las autoridades competentes.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          4. Base jurídica
        </h2>
        <p>
          El tratamiento se basa principalmente en la ejecución de un contrato
          (art. 6.1.b RGPD) y en el interés legítimo del responsable en mejorar
          el servicio (art. 6.1.f RGPD). Cuando sea necesario el consentimiento,
          se solicitará de forma explícita.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          5. Conservación de los datos
        </h2>
        <p>
          Los datos se conservan durante el tiempo necesario para prestar el
          servicio y cumplir las obligaciones legales. Las búsquedas pueden
          anonimizarse o agregarse con fines estadísticos.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          6. Comunicación a terceros
        </h2>
        <p>
          Algunos datos pueden compartirse con terceros proveedores que nos
          ayudan a prestar el servicio, por ejemplo:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>proveedor de pagos (Stripe);</li>
          <li>proveedor de infraestructura y alojamiento;</li>
          <li>herramientas de analítica y monitorización en forma agregada.</li>
        </ul>
        <p>
          Estos terceros actúan como encargados del tratamiento conforme a
          acuerdos que cumplen los requisitos del RGPD.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          7. Derechos de los interesados
        </h2>
        <p>
          De acuerdo con la normativa aplicable, puedes ejercer los derechos de
          acceso, rectificación, supresión, limitación, oposición y
          portabilidad, dentro de los límites previstos por la ley. Para
          ejercerlos, puedes contactarnos mediante la dirección indicada en la
          página de contacto.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          8. Cambios en esta política
        </h2>
        <p>
          Esta política de privacidad puede actualizarse. En caso de cambios
          importantes, te informaremos a través del sitio web o por correo
          electrónico.
        </p>
      </section>

      <div className="mt-10 text-xs text-slate-500 border-t border-slate-200 pt-4">
        © {new Date().getFullYear()} iFindItForYou. Todos los derechos
        reservados.
      </div>
    </main>
  );
}
