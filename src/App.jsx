import { useState } from "react";
import { MENU } from "./menu";
import { API_URL, TENANT_ID } from "./config";

export default function App() {
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pedido, setPedido] = useState(null); // pedido creado
  const [estado, setEstado] = useState(null); // estado consultado
  const [error, setError] = useState("");

  const agregar = (plato) => setCarrito((c) => [...c, plato]);
  const quitar = (i) => setCarrito((c) => c.filter((_, idx) => idx !== i));
  const total = carrito.reduce((s, p) => s + p.precio, 0);

  const hacerPedido = async () => {
    if (carrito.length === 0) {
      setError("Agrega al menos un plato a tu pedido.");
      return;
    }
    setError("");
    setEnviando(true);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: TENANT_ID,
          cliente: cliente || "anónimo",
          items: carrito.map((p) => p.nombre),
          origen: "web",
        }),
      });
      const data = await res.json();
      setPedido(data.order);
      setCarrito([]);
    } catch (e) {
      setError("No se pudo enviar el pedido. Revisa tu conexión.");
    } finally {
      setEnviando(false);
    }
  };

  const consultarEstado = async () => {
    if (!pedido) return;
    try {
      const res = await fetch(
        `${API_URL}/orders/${pedido.order_id}?tenant_id=${TENANT_ID}`
      );
      const data = await res.json();
      setEstado(data.estado || "desconocido");
    } catch (e) {
      setError("No se pudo consultar el estado.");
    }
  };

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-inner">
          <p className="eyebrow">陈 · Cocina Chifa</p>
          <h1>Madam Tusan</h1>
          <p className="lema">El sabor de Oriente en tu mesa. Pide y sigue tu pedido en vivo.</p>
        </div>
      </header>

      <main className="contenido">
        <section className="menu">
          <h2 className="seccion-titulo">Nuestra carta</h2>
          <div className="grid">
            {MENU.map((plato) => (
              <article key={plato.id} className="card">
                <div className="card-emoji">{plato.emoji}</div>
                <div className="card-body">
                  <span className="card-cat">{plato.categoria}</span>
                  <h3>{plato.nombre}</h3>
                  <p className="card-desc">{plato.descripcion}</p>
                  <div className="card-foot">
                    <span className="precio">S/ {plato.precio}</span>
                    <button className="btn-add" onClick={() => agregar(plato)}>
                      Agregar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="panel">
          <div className="carrito">
            <h2 className="seccion-titulo">Tu pedido</h2>
            {carrito.length === 0 && (
              <p className="vacio">Aún no agregas platos. Elige de la carta.</p>
            )}
            {carrito.map((p, i) => (
              <div key={i} className="linea">
                <span>{p.emoji} {p.nombre}</span>
                <span className="linea-precio">
                  S/ {p.precio}
                  <button className="btn-quitar" onClick={() => quitar(i)}>×</button>
                </span>
              </div>
            ))}
            {carrito.length > 0 && (
              <div className="total">
                <span>Total</span>
                <span>S/ {total}</span>
              </div>
            )}

            <input
              className="input-nombre"
              placeholder="Tu nombre"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
            <button className="btn-pedir" onClick={hacerPedido} disabled={enviando}>
              {enviando ? "Enviando..." : "Hacer pedido"}
            </button>
            {error && <p className="error">{error}</p>}
          </div>

          {pedido && (
            <div className="seguimiento">
              <h2 className="seccion-titulo">Pedido confirmado</h2>
              <p className="ped-id">N.° {pedido.order_id.slice(0, 8)}</p>
              <p className="ped-estado">Estado: <strong>{estado || pedido.estado}</strong></p>
              <button className="btn-estado" onClick={consultarEstado}>
                Actualizar estado
              </button>
            </div>
          )}
        </aside>
      </main>

      <footer className="pie">
        <p>Madam Tusan · Proyecto académico CS2032 Cloud Computing</p>
      </footer>
    </div>
  );
}
