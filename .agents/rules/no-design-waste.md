---
trigger: always_on
---

# Restrained UI & Zero Design Waste Rule (Anti-Lebay)

Always adhere strictly to these principles when building or updating any UI page, widget, or component:

1. **No Superfluous Notification Banners**:
   - Strictly avoid adding redundant confirmation banners, celebration toasts, or sync notices (e.g., *"Berhasil Tersinkronisasi"*, *"Data Telah Dicatat"*, *"Operasi Sukses"*) above tables or content areas.
   - Standard data persistence and state updates should be quiet and seamless; the updated state is self-evident.

2. **No Over-Highlighted "New" Entries or Decorative Tags**:
   - When a newly created, edited, or archived item appears in a table, list, or stream:
     - DO NOT apply colored background tints (e.g. blue/green washes).
     - DO NOT apply colored rings or glowing accent borders (`ring-2 ring-blue-500`, etc.).
     - DO NOT attach extra decorative header banners, pulsing ping dots (`animate-ping`), or tags like *"ENTRY TERKINI"*, *"BARU DIARSIPKAN"*, or *"STATUS TERCATAT"*.
   - The new item must look completely consistent with standard rows/cards in the system.

3. **Subtle & Functional Motion Only**:
   - For item entrances, use only a simple, natural slide and fade from the top (`slide-in-from-top-4 fade-in duration-500 ease-out`) that gracefully pushes lower items down.
   - Avoid attention-grabbing bouncing, pulsing badges, or loud color shifts.

4. **Visual Economy**:
   - Minimize visual noise. Every pixel and badge must serve a real clinical or operational function, not design decoration.
