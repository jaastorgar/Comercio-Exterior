from dataclasses import dataclass
from typing import List, Dict, Tuple

@dataclass(frozen=True)
class Container:
    code: str
    length_cm: float
    width_cm: float
    height_cm: float

CATALOG = {
    "20DV": Container("20DV", length_cm=590.0, width_cm=235.0, height_cm=239.0),
    "40DV": Container("40DV", length_cm=1203.0, width_cm=235.0, height_cm=239.0),
    "40HC": Container("40HC", length_cm=1203.0, width_cm=235.0, height_cm=269.0),
}

def _best_orientation(box: Tuple[float, float, float], cont: Container, allow_rotation: bool):
    l, w, h = box
    options = [(l, w, h)]
    if allow_rotation:
        options += [(w, l, h)]  # rotación simple (girar base)

    best = None
    best_fit = -1

    for (L, W, H) in options:
        nx = int(cont.length_cm // L)
        ny = int(cont.width_cm // W)
        nz = int(cont.height_cm // H)
        fit = nx * ny * nz
        if fit > best_fit:
            best_fit = fit
            best = (L, W, H, nx, ny, nz)

    return best  # (L,W,H,nx,ny,nz)

def pack_positions(container_code: str, box_lwh_cm: Tuple[float, float, float], quantity: int, allow_rotation: bool, max_positions: int = 500):
    cont = CATALOG[container_code]
    best = _best_orientation(box_lwh_cm, cont, allow_rotation)
    L, W, H, nx, ny, nz = best

    max_fit = nx * ny * nz
    fit_count = min(quantity, max_fit)

    # posiciones en cm, origen en una esquina inferior
    positions: List[Dict] = []
    count = min(fit_count, max_positions)

    idx = 0
    for k in range(nz):
        for j in range(ny):
            for i in range(nx):
                if idx >= count:
                    break
                x = (i * L) + (L / 2)
                y = (j * W) + (W / 2)
                z = (k * H) + (H / 2)
                positions.append({"x_cm": x, "y_cm": y, "z_cm": z})
                idx += 1
            if idx >= count:
                break
        if idx >= count:
            break

    return {
        "container": {
            "code": cont.code,
            "length_cm": cont.length_cm,
            "width_cm": cont.width_cm,
            "height_cm": cont.height_cm,
        },
        "box": {"length_cm": L, "width_cm": W, "height_cm": H, "rotated_base": (L, W) != box_lwh_cm[:2]},
        "fit_count": fit_count,
        "requested": quantity,
        "positions": positions,
        "note": f"Mostrando {len(positions)} cajas en 3D (de {fit_count} que caben).",
    }