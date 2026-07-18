"use client";

import { UserCheck } from "lucide-react";
import Link from "next/link";

export default function MyReservationsUserBookings({
  myBookings,
  currentUser,
  lang,
}) {
  if (!currentUser) return null;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm no-print">
      <h2 className="text-base font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
        <UserCheck className="w-5 h-5 text-brand-red" />
        <span>Rezerwacje przypisane do Twojego konta:</span>
      </h2>

      {myBookings.length > 0 ? (
        <div className="divide-y divide-slate-100 border-b">
          {myBookings.map((b) => (
            <div key={b.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-900 font-mono font-black">
                  {b.id}
                </p>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  {b.dates.pickupDate} - {b.dates.returnDate} |{" "}
                  <strong className="text-slate-700">
                    {b.car.brand} {b.car.model}
                  </strong>
                </p>
              </div>
              {/* <Link
                href={`/my-reservations?id=${b.id}&email=${encodeURIComponent(b.customer.email)}`}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-black text-slate-700 transition"
              >
                ZOBACZ / PRINT VOUCHER
              </Link> */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 py-2">
          Brak aktywnych rezerwacji dla konta {currentUser.email}.
        </p>
      )}
    </div>
  );
}
