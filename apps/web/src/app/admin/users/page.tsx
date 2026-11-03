"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api, AuthUser } from "@/lib/api";
import {
  ShieldCheck,
  Users,
  Search,
  Filter,
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  MoreVertical,
  Mail,
  Calendar,
  Lock,
} from "lucide-react";

export default function AdminUsersPage() {
  const { user: currentAdmin, isAuthenticated } = useAuth();

  const [users, setUsers] = useState<
    (AuthUser & { promptsCount: number; contextPacksCount: number })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal State for Creating Staff
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [creatingStaff, setCreatingStaff] = useState(false);

  // Status updating state
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getUsers({
        role: roleFilter !== "ALL" ? roleFilter : undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        search: searchQuery.trim() || undefined,
      });
      setUsers(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load users";
      setToast({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentAdmin?.role === "ADMIN") {
      fetchUsers();
    }
  }, [isAuthenticated, currentAdmin, roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleStatusChange = async (
    targetUserId: string,
    newStatus: "ACTIVE" | "SUSPENDED" | "DISABLED"
  ) => {
    setUpdatingId(targetUserId);
    setToast(null);

    try {
      await api.admin.updateUserStatus(targetUserId, newStatus);
      setToast({
        type: "success",
        text: `Account status updated to ${newStatus}.`,
      });
      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, status: newStatus } : u))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update user status";
      setToast({ type: "error", text: msg });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim() || !staffPassword.trim()) {
      setToast({ type: "error", text: "Please fill out all staff fields." });
      return;
    }

    if (staffPassword.length < 8) {
      setToast({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }

    setCreatingStaff(true);
    setToast(null);

    try {
      const newStaff = await api.admin.createStaffUser({
        name: staffName.trim(),
        email: staffEmail.trim(),
        password: staffPassword.trim(),
        role: "ADMIN",
      });

      setToast({
        type: "success",
        text: `Staff user "${newStaff.name}" (${newStaff.email}) created with Admin role!`,
      });

      setIsModalOpen(false);
      setStaffName("");
      setStaffEmail("");
      setStaffPassword("");

      // Refresh list
      fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create staff user";
      setToast({ type: "error", text: msg });
    } finally {
      setCreatingStaff(false);
    }
  };

  if (!isAuthenticated || currentAdmin?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#05060A] text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#090D14] border border-[#25343F] text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Administrator Access Required</h2>
          <p className="text-xs text-slate-400">
            You must be logged in as an Administrator to access User and Staff Management.
          </p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 rounded-xl bg-[#FE7F2D] text-slate-950 font-bold text-xs"
          >
            Sign In with Admin Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060A] text-slate-100 pt-8 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#FE7F2D]/10 border border-[#FE7F2D]/30 text-[#FE7F2D]">
                <Users className="w-4 h-4" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                User & Staff Management
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Inspect user permissions, manage account status, and create new Administrator staff credentials.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(254,127,45,0.25)] transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Create Staff Admin</span>
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-3 animate-in fade-in ${
              toast.type === "success"
                ? "bg-emerald-950/50 border border-emerald-500/40 text-emerald-300"
                : "bg-rose-950/50 border border-rose-500/40 text-rose-300"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#090D14] border border-[#25343F] mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by user name or email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D]"
            />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-1 md:flex-initial">
              <span>Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-none focus:border-[#FE7F2D]"
              >
                <option value="ALL">All Roles</option>
                <option value="CREATOR">Creator</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin / Staff</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-1 md:flex-initial">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-none focus:border-[#FE7F2D]"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="DISABLED">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="rounded-2xl bg-[#090D14] border border-[#25343F] overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-xs text-slate-400">
              <div className="w-6 h-6 border-2 border-[#FE7F2D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span>Loading user directory...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="p-16 text-center text-xs text-slate-400 space-y-2">
              <Users className="w-8 h-8 text-slate-500 mx-auto opacity-50" />
              <p className="font-semibold text-white">No users match the criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#25343F] bg-[#05060A]/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Assets Created</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-4 text-right">Account Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#25343F]/50">
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-[#25343F]/20 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#05060A] border border-[#25343F] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {u.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {u.id === currentAdmin?.id && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            u.role === "ADMIN"
                              ? "bg-purple-950/80 text-purple-300 border border-purple-500/40"
                              : u.role === "CREATOR"
                              ? "bg-[#FE7F2D]/15 text-[#FE7F2D] border border-[#FE7F2D]/30"
                              : "bg-[#25343F] text-slate-300"
                          }`}
                        >
                          {u.role === "ADMIN" && <ShieldCheck className="w-3 h-3 text-purple-400" />}
                          {u.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            u.status === "ACTIVE"
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                              : u.status === "SUSPENDED"
                              ? "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                              : "bg-rose-950/60 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === "ACTIVE"
                                ? "bg-emerald-400"
                                : u.status === "SUSPENDED"
                                ? "bg-amber-400"
                                : "bg-rose-400"
                            }`}
                          />
                          <span>{u.status}</span>
                        </span>
                      </td>

                      {/* Assets Created */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {u.promptsCount} Prompts
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-400">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {u.id === currentAdmin?.id ? (
                          <span className="text-[11px] text-slate-500 italic">
                            Current Session
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {u.status !== "ACTIVE" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(u.id, "ACTIVE")}
                                disabled={updatingId === u.id}
                                className="px-2.5 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition-all cursor-pointer"
                              >
                                Activate
                              </button>
                            )}
                            {u.status !== "SUSPENDED" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(u.id, "SUSPENDED")}
                                disabled={updatingId === u.id}
                                className="px-2.5 py-1 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 text-[11px] font-semibold transition-all cursor-pointer"
                              >
                                Suspend
                              </button>
                            )}
                            {u.status !== "DISABLED" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(u.id, "DISABLED")}
                                disabled={updatingId === u.id}
                                className="px-2.5 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-[11px] font-semibold transition-all cursor-pointer"
                              >
                                Disable
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
             MODAL: CREATE STAFF / ADMIN ACCOUNT
             ══════════════════════════════════════════════════════════════════ */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
            <div className="max-w-md w-full p-6 rounded-2xl bg-[#090D14] border border-[#25343F] shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#25343F]">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <UserPlus className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    Create New Staff Admin
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Staff administrators have platform-level access to review creator submissions, manage accounts, and monitor analytics.
              </p>

              <form onSubmit={handleCreateStaff} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Full Name <span className="text-[#FE7F2D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Work Email <span className="text-[#FE7F2D]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    placeholder="staff@contextnode.ai"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Temporary Password <span className="text-[#FE7F2D]">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#25343F]/60 text-slate-300 text-xs font-semibold hover:bg-[#25343F]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingStaff}
                    className="px-5 py-2 rounded-xl bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-slate-950 text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {creatingStaff ? "Creating..." : "Create Admin Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

