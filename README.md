# Organizador de Materias

**¿En qué materias me anoto? ¿Esta me desbloquea algo? ¿Cuánto me falta para recibirme?**

Una web que organiza tu trayectoria académica. Cargás tus materias aprobadas y en segundos ves qué podés cursar, qué te conviene priorizar y en cuántos cuatrimestres te recibís.

🔗 **[Ver demo en vivo](https://organizador-materias.vercel.app)**

---

## ¿Qué hace?

- ✅ **Seguimiento de materias** — marcás las que aprobaste y el sistema actualiza todo automáticamente
- 🔓 **Materias disponibles** — muestra exactamente qué podés cursar ahora según tus correlativas
- 🎯 **Camino crítico** — calcula qué materias priorizar para recibirte lo antes posible
- 📅 **Simulador de egreso** — elegís cuándo querés recibirte y te genera un plan cuatrimestre a cuatrimestre
- 🕸️ **Grafo de dependencias** — visualización interactiva de todas las correlativas de la carrera
- 💾 **Persistencia local** — tu progreso se guarda automáticamente en el navegador

---

## Stack

| Tecnología | Uso |
|---|---|
| Next.js 16 | Framework principal |
| TypeScript | Tipado estático |
| Tailwind CSS v4 | Estilos |
| React Flow | Grafo interactivo |
| Dagre | Layout automático del grafo |

---

## Algoritmos

**Camino crítico** — Dynamic programming sobre un DAG (grafo acíclico dirigido). Encuentra la cadena más larga de materias pendientes para identificar cuáles desbloquean más camino hacia la graduación.

**Simulador de egreso** — Algoritmo greedy con ordenamiento topológico. En cada cuatrimestre toma las materias disponibles y las prioriza según cuántas materias futuras desbloquean.

---

## Cómo usarlo

1. Entrás a la web
2. Hacés click en las materias que ya aprobaste
3. El sistema muestra automáticamente qué tenés disponible, qué priorizar y cuánto falta
4. Usás el simulador para planificar tu egreso

Tu progreso se guarda en el navegador — no hace falta cuenta ni registro.

---

## Correr localmente

```bash
git clone https://github.com/lviladrich/organizador-materias.git
cd organizador-materias
pnpm install
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000)

---

## Adaptarlo a otra carrera

El sistema lee los datos desde `src/data/materias.json`. Para adaptarlo a otra carrera reemplazás ese archivo con tu propio plan de estudios siguiendo la misma estructura.

---

Hecho por **Lucia Viladrich** — [LinkedIn](https://www.linkedin.com/in/lucia-viladrich)
