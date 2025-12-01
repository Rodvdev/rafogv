"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

interface Workshop {
  id: string;
  name: string;
  type: string;
  description: string | null;
  services: string[];
  checked: boolean;
  address: {
    street: string | null;
    district: string;
  } | null;
  contact: {
    phone: string | null;
    email: string | null;
    website: string | null;
  } | null;
}

interface Rectifier {
  id: string;
  name: string;
  type: string;
  description: string | null;
  specialties: string[];
  checked: boolean;
  address: {
    street: string | null;
    district: string;
  } | null;
  contact: {
    phone: string | null;
    email: string | null;
    website: string | null;
  } | null;
}

export default function DashboardContent() {
  const { data: session } = useSession();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [rectifiers, setRectifiers] = useState<Rectifier[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"workshops" | "rectifiers">("workshops");
  const [editing, setEditing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workshopsRes, rectifiersRes] = await Promise.all([
        fetch("/api/workshops"),
        fetch("/api/rectifiers"),
      ]);
      const workshopsData = await workshopsRes.json();
      const rectifiersData = await rectifiersRes.json();
      setWorkshops(workshopsData);
      setRectifiers(rectifiersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChecked = async (id: string, type: "workshop" | "rectifier") => {
    try {
      const endpoint = type === "workshop" ? `/api/workshops/${id}` : `/api/rectifiers/${id}`;
      const current = type === "workshop" 
        ? workshops.find(w => w.id === id)
        : rectifiers.find(r => r.id === id);
      
      await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked: !current?.checked }),
      });

      fetchData();
    } catch (error) {
      console.error("Error toggling checked:", error);
    }
  };

  const handleDelete = async (id: string, type: "workshop" | "rectifier") => {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return;

    try {
      const endpoint = type === "workshop" ? `/api/workshops/${id}` : `/api/rectifiers/${id}`;
      await fetch(endpoint, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">Dashboard - Talleres Lima</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session?.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setActiveTab("workshops")}
            className={`rounded-md px-4 py-2 ${
              activeTab === "workshops"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Talleres ({workshops.length})
          </button>
          <button
            onClick={() => setActiveTab("rectifiers")}
            className={`rounded-md px-4 py-2 ${
              activeTab === "rectifiers"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Rectificadoras ({rectifiers.length})
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            + Agregar {activeTab === "workshops" ? "Taller" : "Rectificadora"}
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  ✓
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Distrito
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {activeTab === "workshops"
                ? workshops.map((workshop) => (
                    <tr key={workshop.id} className={workshop.checked ? "bg-green-50" : ""}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <input
                          type="checkbox"
                          checked={workshop.checked}
                          onChange={() => toggleChecked(workshop.id, "workshop")}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {workshop.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {workshop.type}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {workshop.address?.district || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {workshop.contact?.phone || workshop.contact?.email || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <button
                          onClick={() => setEditing(workshop.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(workshop.id, "workshop")}
                          className="ml-4 text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                : rectifiers.map((rectifier) => (
                    <tr key={rectifier.id} className={rectifier.checked ? "bg-green-50" : ""}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <input
                          type="checkbox"
                          checked={rectifier.checked}
                          onChange={() => toggleChecked(rectifier.id, "rectifier")}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {rectifier.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {rectifier.type}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {rectifier.address?.district || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {rectifier.contact?.phone || rectifier.contact?.email || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <button
                          onClick={() => setEditing(rectifier.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(rectifier.id, "rectifier")}
                          className="ml-4 text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

