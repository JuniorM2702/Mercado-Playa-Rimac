export interface Product {
    idproducto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad: number;
    categoria: string;
    imagenUrl?: string; // Opcional
    enOferta: boolean;
    precioOferta?: number; // Opcional
  }