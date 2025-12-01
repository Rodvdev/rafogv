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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Total Talleres</p>
                  <p className="text-3xl font-bold text-white">{workshopPagination.total}</p>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">Total Rectificadoras</p>
                  <p className="text-3xl font-bold text-white">{rectifierPagination.total}</p>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => {
              setActiveTab("workshops");
              setWorkshopPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`group flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all ${
              activeTab === "workshops"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 shadow hover:bg-gray-50 hover:shadow-md"
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Talleres
            <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
              activeTab === "workshops" ? "bg-white/20" : "bg-gray-200"
            }`}>
              {workshopPagination.total}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab("rectifiers");
              setRectifierPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`group flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all ${
              activeTab === "rectifiers"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "bg-white text-gray-700 shadow hover:bg-gray-50 hover:shadow-md"
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Rectificadoras
            <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
              activeTab === "rectifiers" ? "bg-white/20" : "bg-gray-200"
            }`}>
              {rectifierPagination.total}
            </span>
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="mb-6 flex flex-wrap gap-4 rounded-xl bg-white p-6 shadow-lg">
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
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2.5 font-medium text-white shadow-md transition-all hover:from-green-700 hover:to-emerald-700 hover:shadow-lg active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar {activeTab === "workshops" ? "Taller" : "Rectificadora"}
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-xl bg-white shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
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
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                      <p className="mt-4 text-sm font-medium text-gray-500">Cargando datos...</p>
                    </div>
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-4 text-sm font-medium text-gray-500">No se encontraron registros</p>
                      <p className="mt-1 text-xs text-gray-400">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      item.checked 
                        ? "bg-green-50 hover:bg-green-100" 
                        : "hover:bg-gray-50"
                    }`}
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
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            const editPath = activeTab === "workshops" 
                              ? `/dashboard/workshops/${item.id}/edit`
                              : `/dashboard/rectifiers/${item.id}/edit`;
                            router.push(editPath);
                          }}
                          className="flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-blue-700 transition-all hover:bg-blue-100 hover:text-blue-900"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item.id, activeTab === "workshops" ? "workshop" : "rectifier")
                          }
                          className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-red-700 transition-all hover:bg-red-100 hover:text-red-900"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {currentPagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow-lg">
            <div className="text-sm text-gray-600">
              Mostrando{" "}
              <span className="font-semibold text-gray-900">
                {(currentPagination.page - 1) * currentPagination.limit + 1}
              </span>{" "}
              a{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(currentPagination.page * currentPagination.limit, currentPagination.total)}
              </span>{" "}
              de <span className="font-semibold text-gray-900">{currentPagination.total}</span> resultados
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPagination.page - 1)}
                disabled={currentPagination.page === 1}
                className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:shadow-none"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
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
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        currentPagination.page === pageNum
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm"
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
                className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:shadow-none"
              >
                Siguiente
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
