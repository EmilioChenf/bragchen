# FIRMA · Proyecto final de Emprendimiento e Innovación (UVG)

> *Innova tu regalo, firma tu arte.* Termos, pachones y tazas personalizados con vista previa 3D, precio final y fecha de entrega visibles antes de pagar.

Entrega 4: documento final, presentación y página web.

| Carpeta | Contenido |
|---|---|
| `documento/` | `Proyecto-Entrega-4-Documento-Final.docx` y `.pdf` (documento a entregar) y `FIRMA-modelo-financiero.xlsx` (supuestos, flujo de efectivo a 5 años y análisis financiero con fórmulas editables). |
| `presentacion/` | Presentación web animada de 15 diapositivas. Abre `index.html`. |
| `web/` | Página web de FIRMA con configurador 3D, catálogo, calculadora para empresas y seguimiento de pedidos. Abre `index.html`. |

## Cómo usar la presentación

- **→ / Espacio / clic**: siguiente diapositiva · **←**: anterior · **F**: pantalla completa.
- En celular se avanza deslizando.
- `index.html#9` abre directamente la diapositiva 9.
- En la diapositiva 4 (propuesta de valor) el configurador 3D funciona en vivo: cambia el producto y el color frente al público.

## Cómo ver la página web

Abre `web/index.html` en el navegador. Si no hay internet, three.js se carga desde `web/vendor/`. Para servirla localmente:

```bash
cd proyecto-final && python3 -m http.server 8000
```

Después abre <http://localhost:8000/web/> y <http://localhost:8000/presentacion/>.

## Cifras clave (modelo financiero, en Q sin IVA)

| Indicador | Valor |
|---|---|
| Inversión inicial | Q39,500 |
| Ingresos Año 1 → Año 5 | Q96,626 → Q410,544 |
| EBIT Año 1 → Año 5 | Q17,908 → Q83,443 |
| Punto de equilibrio Año 1 | 63 unidades/mes |
| Recuperación de la inversión | 18 meses |
| ROI a 5 años | 399.8 % |
| VAN (15 %) / TIR | Q81,334 / 68.3 % |
