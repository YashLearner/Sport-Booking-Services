import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourts, selectAllCourts, selectCourtsStatus } from "../../features/courts/courtSlice";
import AdminCourtModal from "../../components/admin/AdminCourtModal";
import DeleteCourtModal from "../../components/admin/DeleteCourtModal";
import SkeletonCard from "../../components/common/SkeletonCard";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheckCircle, FiXCircle, FiMapPin, FiUsers } from "react-icons/fi";

export default function AdminCourts() {
  const dispatch = useDispatch();
  const courts = useSelector(selectAllCourts);
  const status = useSelector(selectCourtsStatus);

  const [search, setSearch] = useState("");
  const [selectedCourtForEdit, setSelectedCourtForEdit] = useState(null);
  const [selectedCourtForDelete, setSelectedCourtForDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCourts());
  }, [dispatch]);

  const filteredCourts = courts.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setSelectedCourtForEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (court) => {
    setSelectedCourtForEdit(court);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (court) => {
    setSelectedCourtForDelete(court);
    setIsDeleteModalOpen(true);
  };

  const isLoading = status === "loading";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Court Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create, update, toggle availability, or delete sports venues
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center space-x-2 w-fit"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add New Court</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter courts by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Courts Table */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Court Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price / Hour</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {filteredCourts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No courts found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredCourts.map((court) => (
                    <tr key={court._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {court.name}
                      </td>
                      <td className="p-4 flex items-center space-x-1">
                        <FiMapPin className="text-emerald-600" />
                        <span>{court.location}</span>
                      </td>
                      <td className="p-4 font-bold">${court.pricePerHour}</td>
                      <td className="p-4">{court.capacity} Players</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                            court.isAvailable
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                              : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                          }`}
                        >
                          {court.isAvailable ? <FiCheckCircle /> : <FiXCircle />}
                          <span>{court.isAvailable ? "Available" : "Unavailable"}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(court)}
                            title="Edit Court"
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 transition-colors"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Button (Triggers DELETE /api/courts/:id API) */}
                          <button
                            onClick={() => handleOpenDelete(court)}
                            title="Delete Court"
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AdminCourtModal
        court={selectedCourtForEdit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <DeleteCourtModal
        court={selectedCourtForDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
