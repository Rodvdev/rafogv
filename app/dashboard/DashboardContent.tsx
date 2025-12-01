"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function DashboardContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [rectifiers, setRectifiers] = useState<Rectifier[]>([]);
  const [workshopPagination, setWorkshopPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [rectifierPagination, setRectifierPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"workshops" | "rectifiers">("workshops");
  const [editing, setEditing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterChecked, setFilterChecked] = useState<string>("all");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Cargar totales al inicio (sin filtros)
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [workshopsRes, rectifiersRes] = await Promise.all([
          fetch("/api/workshops?page=1&limit=1"),
          fetch("/api/rectifiers?page=1&limit=1"),
        ]);
        const workshopsResult = await workshopsRes.json();
        const rectifiersResult = await rectifiersRes.json();
        
        setWorkshopPagination(prev => ({ ...prev, total: workshopsResult.pagination.total }));
        setRectifierPagination(prev => ({ ...prev, total: rectifiersResult.pagination.total }));
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    };
    fetchTotals();
  }, []);

  // Cargar datos cuando cambian los filtros, paginación o ordenamiento
  useEffect(() => {
    fetchData();
  }, [activeTab, workshopPagination.page, rectifierPagination.page, search, filterChecked, filterDistrict, sortBy, sortOrder]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: activeTab === "workshops" ? workshopPagination.page.toString() : rectifierPagination.page.toString(),
        limit: "10",
      });

      if (search) {
        params.append("search", search);
      }

      if (filterChecked !== "all") {
        params.append("checked", filterChecked);
      }

      if (filterDistrict) {
        params.append("district", filterDistrict);
      }

      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      const endpoint = activeTab === "workshops" ? `/api/workshops?${params}` : `/api/rectifiers?${params}`;
      const response = await fetch(endpoint);
      const result = await response.json();

      if (activeTab === "workshops") {
        setWorkshops(result.data);
        setWorkshopPagination(prev => ({ ...prev, ...result.pagination }));
      } else {
        setRectifiers(result.data);
        setRectifierPagination(prev => ({ ...prev, ...result.pagination }));
      }
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

  const handlePageChange = (newPage: number) => {
    if (activeTab === "workshops") {
      setWorkshopPagination(prev => ({ ...prev, page: newPage }));
    } else {
      setRectifierPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Si ya está ordenando por esta columna, cambiar el orden
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Nueva columna, ordenar ascendente por defecto
      setSortBy(column);
      setSortOrder("asc");
    }
    // Resetear a página 1 cuando cambia el ordenamiento
    if (activeTab === "workshops") {
      setWorkshopPagination(prev => ({ ...prev, page: 1 }));
    } else {
      setRectifierPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) {
      return <span className="ml-1 text-gray-400">↕</span>;
    }
    return sortOrder === "asc" ? (
      <span className="ml-1 text-blue-600">↑</span>
    ) : (
      <span className="ml-1 text-blue-600">↓</span>
    );
  };

  const currentPagination = activeTab === "workshops" ? workshopPagination : rectifierPagination;
  const currentData = activeTab === "workshops" ? workshops : rectifiers;

  if (loading && currentData.length === 0) {
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
            <h1 className="text-xl font-bold text-gray-900">Dashboard - Talleres Lima</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-900">{session?.user?.email}</span>
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
            onClick={() => {
              setActiveTab("workshops");
              setWorkshopPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`rounded-md px-4 py-2 ${
              activeTab === "workshops"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Talleres ({workshopPagination.total})
          </button>
          <button
            onClick={() => {
              setActiveTab("rectifiers");
              setRectifierPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`rounded-md px-4 py-2 ${
              activeTab === "rectifiers"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Rectificadoras ({rectifierPagination.total})
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="mb-4 flex flex-wrap gap-4 rounded-lg bg-white p-4 shadow">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (activeTab === "workshops") {
                  setWorkshopPagination(prev => ({ ...prev, page: 1 }));
                } else {
                  setRectifierPagination(prev => ({ ...prev, page: 1 }));
                }
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterChecked}
              onChange={(e) => {
                setFilterChecked(e.target.value);
                if (activeTab === "workshops") {
                  setWorkshopPagination(prev => ({ ...prev, page: 1 }));
                } else {
                  setRectifierPagination(prev => ({ ...prev, page: 1 }));
                }
              }}
              className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="true">Verificados</option>
              <option value="false">No verificados</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Filtrar por distrito..."
              value={filterDistrict}
              onChange={(e) => {
                setFilterDistrict(e.target.value);
                if (activeTab === "workshops") {
                  setWorkshopPagination(prev => ({ ...prev, page: 1 }));
                } else {
                  setRectifierPagination(prev => ({ ...prev, page: 1 }));
                }
              }}
              className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              onClick={() => setShowAddForm(true)}
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              + Agregar {activeTab === "workshops" ? "Taller" : "Rectificadora"}
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  ✓
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer hover:bg-gray-100 select-none"
                >
                  <div className="flex items-center">
                    Nombre
                    <SortIcon column="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("type")}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer hover:bg-gray-100 select-none"
                >
                  <div className="flex items-center">
                    Tipo
                    <SortIcon column="type" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("district")}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer hover:bg-gray-100 select-none"
                >
                  <div className="flex items-center">
                    Distrito
                    <SortIcon column="district" />
                  </div>
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron registros
                  </td>
                </tr>
              ) : (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    className={item.checked ? "bg-green-50" : ""}
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() =>
                          toggleChecked(item.id, activeTab === "workshops" ? "workshop" : "rectifier")
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {item.contact?.website ? (
                        <a
                          href={item.contact.website.startsWith('http') ? item.contact.website : `https://${item.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {item.name}
                        </a>
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {item.type}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {item.address?.district || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {item.contact?.phone || item.contact?.email || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => {
                          const editPath = activeTab === "workshops" 
                            ? `/dashboard/workshops/${item.id}/edit`
                            : `/dashboard/rectifiers/${item.id}/edit`;
                          router.push(editPath);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(item.id, activeTab === "workshops" ? "workshop" : "rectifier")
                        }
                        className="ml-4 text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {currentPagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow">
            <div className="text-sm text-gray-700">
              Mostrando{" "}
              <span className="font-medium">
                {(currentPagination.page - 1) * currentPagination.limit + 1}
              </span>{" "}
              a{" "}
              <span className="font-medium">
                {Math.min(currentPagination.page * currentPagination.limit, currentPagination.total)}
              </span>{" "}
              de <span className="font-medium">{currentPagination.total}</span> resultados
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPagination.page - 1)}
                disabled={currentPagination.page === 1}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, currentPagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (currentPagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (currentPagination.page >= currentPagination.totalPages - 2) {
                    pageNum = currentPagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`rounded-md px-3 py-2 text-sm font-medium ${
                        currentPagination.page === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPagination.page + 1)}
                disabled={currentPagination.page === currentPagination.totalPages}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
