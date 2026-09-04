"use client"

import React, { useState, useRef, useEffect } from "react"
import { useOrg } from "@/context/OrgContext"
import {
  BuildingIcon,
  ChevronDownIcon,
  CheckIcon,
  PlusIcon,
  UserPlusIcon
} from "@/components/Icons"

export default function OrgSwitcher({ compact = false }) {
  const {
    approvedOrgs,
    activeOrg,
    activeOrgId,
    switchOrg,
    openCreateModal,
    openJoinModal,
    userState,
  } = useOrg()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const label =
    userState === "new"
      ? "Set Up Workspace"
      : activeOrg?.name || "Select Workspace"

  return (
    <div className="relative" ref={menuRef}>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setDropdownOpen(prev => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border shadow-2xs hover:border-stone-300 hover:bg-stone-50 transition-all cursor-pointer ${
          compact
            ? "text-xs font-bold"
            : "text-xs sm:text-sm font-bold"
        } text-stone-900 border-stone-200/90`}
      >
        <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0 bg-[#111318] text-lime-400">
          <BuildingIcon size={12} strokeWidth={2.5} />
        </div>

        <span className="truncate max-w-[140px] sm:max-w-[190px]">
          {label}
        </span>

        <ChevronDownIcon
          size={14}
          className={`text-stone-400 transition-transform duration-200 shrink-0 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white rounded-3xl border border-stone-200/90 shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">

          {/* Organizations */}
          {approvedOrgs.length > 0 && (
            <>
              <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-stone-400 font-mono">
                Your Organizations
              </div>

              <div className="space-y-1 my-1 max-h-52 overflow-y-auto">
                {approvedOrgs.map(org => {
                  const isActive = org.id === activeOrgId

                  return (
                    <button
                      key={org.id}
                      type="button"
                      onClick={() => {
                        switchOrg(org.id)
                        setDropdownOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#111318] text-white shadow-xs"
                          : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">

                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isActive
                              ? "bg-lime-400"
                              : "bg-stone-300"
                          }`}
                        />

                        <div className="truncate text-left">
                          <div className="font-bold truncate">
                            {org.name}
                          </div>

                          <div
                            className={`text-[10px] font-normal truncate ${
                              isActive
                                ? "text-stone-300"
                                : "text-stone-400"
                            }`}
                          >
                            {org.role || "Member"}
                          </div>
                        </div>
                      </div>

                      {isActive && (
                        <CheckIcon
                          size={14}
                          className="text-lime-400 shrink-0 ml-2"
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="my-2 border-t border-stone-100" />
            </>
          )}

          {/* No organizations */}
          {approvedOrgs.length === 0 && (
            <div className="px-3 py-3 text-xs text-stone-500">
              You are not a member of any organization yet.
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-1">

            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false)
                openCreateModal()
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-stone-800 hover:bg-stone-100 hover:text-stone-950 transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center">
                <PlusIcon size={13} strokeWidth={2.5} />
              </div>

              <span>+ Create Organization</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false)
                openJoinModal()
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-stone-800 hover:bg-stone-100 hover:text-stone-950 transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center">
                <UserPlusIcon size={13} strokeWidth={2} />
              </div>

              <span>+ Join Organization</span>
            </button>

          </div>
        </div>
      )}
    </div>
  )
}