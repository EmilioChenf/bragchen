# InnovaArte · Proyecto final de Emprendimiento e Innovación (UVG)

> *“Innova tu regalo, firma tu arte”.* Termos, pachones y tazas personalizados en Guatemala: precio claro, fecha de entrega y diseño visible antes de pagar.

Entrega 4: documento final, presentación y página web.

| Carpeta | Contenido |
|---|---|
| `documento/` | `Proyecto-Entrega-4-Documento-Final.docx` y `.pdf` (documento a entregar) y `InnovaArte-modelo-financiero.xlsx` (supuestos con fuentes guatemaltecas, flujo de efectivo a 5 años y análisis financiero con fórmulas editables). |
| `presentacion/` | Presentación web animada de 16 diapositivas. Abre `index.html`. |
| `web/` | Página web de InnovaArte con configurador 3D (foto en marcos de corazón, círculo, cuadro, rectángulo, triángulo o estrella, de 1 a 8 alrededor del producto, o cubriendo toda la taza), catálogo, calculadora para empresas y seguimiento de pedidos. Abre `index.html`. |

## Cómo usar la presentación

- **→ / Espacio / clic**: siguiente diapositiva · **←**: anterior · **F**: pantalla completa.
- En celular se avanza deslizando.
- `index.html#9` abre directamente la diapositiva 9.
- En la diapositiva 4 (propuesta de valor) el configurador 3D funciona en vivo: cambia el producto, el color y la foto (corazones o toda la taza) frente al público.

## Cómo ver la página web

Abre `web/index.html` en el navegador. Si no hay internet, three.js se carga desde `web/vendor/`. Para servirla localmente:

```bash
cd proyecto-final && python3 -m http.server 8000
```

Después abre <http://localhost:8000/web/> y <http://localhost:8000/presentacion/>.

## Cifras clave (modelo financiero, en quetzales)

| Indicador | Valor |
|---|---|
| Precios | Termo Q80 · pachón Q70 · taza Q40 |
| Forma jurídica | Sociedad de Emprendimiento (Decreto 20-2018) → Sociedad Anónima al crecer |
| Régimen tributario | Pequeño Contribuyente, 5 % sobre ventas (Ley del IVA, Decreto 31-2024) |
| Inversión inicial | Q23,500 |
| Ventas Año 1 → Año 5 | Q73,145 → Q313,856 |
| EBIT Año 1 → Año 5 | Q12,109 → Q35,146 |
| Punto de equilibrio Año 1 | 61 unidades/mes |
| Recuperación de la inversión | 15 meses |
| ROI a 5 años | 376.1 % |
| VAN (15 %) / TIR | Q47,673 / 77.4 % |
