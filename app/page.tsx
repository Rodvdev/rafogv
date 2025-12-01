import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <main className="w-full max-w-4xl space-y-8 px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Talleres Lima - Base de Datos
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Sistema de gestión de talleres mecánicos y rectificadoras en Lima
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">
            Fuentes Principales
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-md border border-gray-200 p-4 hover:bg-gray-50">
              <div>
                <h3 className="font-medium text-gray-900">TallerMec.net.pe</h3>
                <p className="text-sm text-gray-500">
                  Directorio de talleres mecánicos
                </p>
              </div>
              <a
                href="https://tallermec.net.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Visitar
              </a>
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-200 p-4 hover:bg-gray-50">
              <div>
                <h3 className="font-medium text-gray-900">
                  Páginas Amarillas
                </h3>
                <p className="text-sm text-gray-500">
                  Directorio comercial de Perú
                </p>
              </div>
              <a
                href="https://www.paginasamarillas.com.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Visitar
              </a>
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-200 p-4 hover:bg-gray-50">
              <div>
                <h3 className="font-medium text-gray-900">Ubicania.com</h3>
                <p className="text-sm text-gray-500">
                  Plataforma de ubicación y directorio
                </p>
              </div>
              <a
                href="https://ubicania.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Visitar
              </a>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/signin"
            className="inline-block rounded-md bg-green-600 px-6 py-3 text-lg font-semibold text-white hover:bg-green-700"
          >
            Acceder al Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
