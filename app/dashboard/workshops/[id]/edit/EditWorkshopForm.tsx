"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorkshopType } from "@prisma/client";

interface WorkshopData {
  id: string;
  name: string;
  type: WorkshopType;
  description: string | null;
  services: string[];
  rating: number | null;
  tenantId: string | null;
  checked: boolean;
  address: {
    id: string;
    street: string | null;
    district: string;
    province: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
  } | null;
  contact: {
    id: string;
    phone: string | null;
    phoneAlt: string | null;
    email: string | null;
    whatsapp: string | null;
    website: string | null;
    facebook: string | null;
    instagram: string | null;
  } | null;
}

export default function EditWorkshopForm({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<WorkshopData | null>(null);
  const [serviceInput, setServiceInput] = useState("");

  useEffect(() => {
    fetchWorkshop();
  }, [id]);

  const fetchWorkshop = async () => {
    try {
      const response = await fetch(`/api/workshops/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch workshop");
      }
      const workshop = await response.json();
      setData(workshop);
    } catch (error) {
      console.error("Error fetching workshop:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/workshops/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          description: data.description || null,
          services: data.services,
          rating: data.rating ? parseFloat(data.rating.toString()) : null,
          tenantId: data.tenantId || null,
          checked: data.checked,
          address: data.address
            ? {
                street: data.address.street || null,
                district: data.address.district,
                province: data.address.province,
                country: data.address.country,
                latitude: data.address.latitude ? parseFloat(data.address.latitude.toString()) : null,
                longitude: data.address.longitude ? parseFloat(data.address.longitude.toString()) : null,
              }
            : null,
          contact: data.contact
            ? {
                phone: data.contact.phone || null,
                phoneAlt: data.contact.phoneAlt || null,
                email: data.contact.email || null,
                whatsapp: data.contact.whatsapp || null,
                website: data.contact.website || null,
                facebook: data.contact.facebook || null,
                instagram: data.contact.instagram || null,
              }
            : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update workshop");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error updating workshop:", error);
      alert("Error al actualizar el taller");
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    if (serviceInput.trim() && data) {
      setData({
        ...data,
        services: [...data.services, serviceInput.trim()],
      });
      setServiceInput("");
    }
  };

  const removeService = (index: number) => {
    if (data) {
      setData({
        ...data,
        services: data.services.filter((_, i) => i !== index),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-red-600">Taller no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Editar Taller</h1>
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow">
          {/* Información Básica */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                <input
                  type="text"
                  required
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo *</label>
                <select
                  required
                  value={data.type}
                  onChange={(e) => setData({ ...data, type: e.target.value as WorkshopType })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  {Object.values(WorkshopType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={data.description || ""}
                  onChange={(e) => setData({ ...data, description: e.target.value || null })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={data.rating || ""}
                  onChange={(e) =>
                    setData({ ...data, rating: e.target.value ? parseFloat(e.target.value) : null })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.checked}
                    onChange={(e) => setData({ ...data, checked: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Verificado</span>
                </label>
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Servicios</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addService();
                  }
                }}
                placeholder="Agregar servicio..."
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addService}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.services.map((service, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                >
                  {service}
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Dirección */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dirección</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Calle</label>
                <input
                  type="text"
                  value={data.address?.street || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      address: {
                        ...(data.address || {
                          id: "",
                          district: "",
                          province: "Lima",
                          country: "Perú",
                          latitude: null,
                          longitude: null,
                        }),
                        street: e.target.value || null,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Distrito *</label>
                <input
                  type="text"
                  required
                  value={data.address?.district || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      address: {
                        ...(data.address || {
                          id: "",
                          street: null,
                          province: "Lima",
                          country: "Perú",
                          latitude: null,
                          longitude: null,
                        }),
                        district: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Provincia</label>
                <input
                  type="text"
                  value={data.address?.province || "Lima"}
                  onChange={(e) =>
                    setData({
                      ...data,
                      address: {
                        ...(data.address || {
                          id: "",
                          street: null,
                          district: "",
                          country: "Perú",
                          latitude: null,
                          longitude: null,
                        }),
                        province: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">País</label>
                <input
                  type="text"
                  value={data.address?.country || "Perú"}
                  onChange={(e) =>
                    setData({
                      ...data,
                      address: {
                        ...(data.address || {
                          id: "",
                          street: null,
                          district: "",
                          province: "Lima",
                          latitude: null,
                          longitude: null,
                        }),
                        country: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Latitud</label>
                <input
                  type="number"
                  step="any"
                  value={data.address?.latitude || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      address: {
                        ...(data.address || {
                          id: "",
                          street: null,
                          district: "",
                          province: "Lima",
                          country: "Perú",
                          longitude: null,
                        }),
                        latitude: e.target.value ? parseFloat(e.target.value) : null,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Longitud</label>
                <input
                  type="number"
                  step="any"
                  value={data.address?.longitude || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      address: {
                        ...(data.address || {
                          id: "",
                          street: null,
                          district: "",
                          province: "Lima",
                          country: "Perú",
                          latitude: null,
                        }),
                        longitude: e.target.value ? parseFloat(e.target.value) : null,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contacto</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="text"
                  value={data.contact?.phone || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contact: {
                        ...(data.contact || {
                          id: "",
                          phoneAlt: null,
                          email: null,
                          whatsapp: null,
                          website: null,
                          facebook: null,
                          instagram: null,
                        }),
                        phone: e.target.value || null,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono Alternativo</label>
                <input
                  type="text"
                  value={data.contact?.phoneAlt || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contact: {
                        ...(data.contact || {
                          id: "",
                          phone: null,
                          email: null,
                          whatsapp: null,
                          website: null,
                          facebook: null,
                          instagram: null,
                        }),
                        phoneAlt: e.target.value || null,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={data.contact?.email || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contact: {
                        ...(data.contact || {
                          id: "",
                          phone: null,
                          phoneAlt: null,
                          whatsapp: null,
                          website: null,
                          facebook: null,
                          instagram: null,
                        }),
                        email: e.target.value || null,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                <input
                  type="text"
                  value={data.contact?.whatsapp || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contact: {
                        ...(data.contact || {
                          id: "",
                          phone: null,
                          phoneAlt: null,
                          email: null,
                          website: null,
                          facebook: null,
                          instagram: null,
                        }),
                        whatsapp: e.target.value || null,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  value={data.contact?.website || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contact: {
                        ...(data.contact || {
                          id: "",
                          phone: null,
                          phoneAlt: null,
                          email: null,
                          whatsapp: null,
                          facebook: null,
                          instagram: null,
                        }),
                        website: e.target.value || null,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Facebook</label>
                <input
                  type="url"
                  value={data.contact?.facebook || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contact: {
                        ...(data.contact || {
                          id: "",
                          phone: null,
                          phoneAlt: null,
                          email: null,
                          whatsapp: null,
                          website: null,
                          instagram: null,
                        }),
                        facebook: e.target.value || null,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instagram</label>
                <input
                  type="text"
                  value={data.contact?.instagram || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contact: {
                        ...(data.contact || {
                          id: "",
                          phone: null,
                          phoneAlt: null,
                          email: null,
                          whatsapp: null,
                          website: null,
                          facebook: null,
                        }),
                        instagram: e.target.value || null,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

