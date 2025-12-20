import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | iFindItForYou",
  description:
    "Respuestas a las preguntas frecuentes sobre cómo funciona iFindItForYou, las búsquedas gratuitas y el plan PRO.",
};

export default function FaqPageEs() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Preguntas frecuentes</h1>

      <section className="space-y-6 text-sm leading-relaxed text-slate-800">
        <div>
          <h2 className="text-lg font-semibold">
            ¿Qué hace exactamente iFindItForYou?
          </h2>
          <p>
            iFindItForYou analiza tu solicitud, utiliza fuentes públicas y
            herramientas de IA, y te devuelve pocas opciones relevantes en lugar
            de una lista infinita de resultados sin filtrar.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            ¿Cuántas búsquedas gratuitas tengo?
          </h2>
          <p>
            El plan Free incluye un número limitado de búsquedas gratuitas al
            mes. Después puedes pasar al plan PRO para tener búsquedas
            ilimitadas y resultados más profundos.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            ¿Qué ventajas tiene el plan PRO?
          </h2>
          <p>
            El plan PRO ofrece búsquedas ilimitadas, prioridad en el
            procesamiento de solicitudes y resultados más detallados. En el
            futuro podrá incluir funciones adicionales como histórico avanzado y
            filtros personalizados.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            ¿Guardan mis datos o mis búsquedas?
          </h2>
          <p>
            Utilizamos tus datos solo para poder ofrecer el servicio y mejorar
            el producto. No vendemos tus datos a terceros. Puedes encontrar más
            detalles en la{" "}
            <a
              href="/es/privacy"
              className="underline text-slate-700 hover:text-slate-900"
            >
              política de privacidad
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            ¿Puedo cancelar el plan PRO?
          </h2>
          <p>
            Sí. Puedes gestionar tu suscripción y cancelarla en cualquier
            momento a través del portal de Stripe asociado a tu cuenta.
          </p>
        </div>
      </section>
    </main>
  );
}
