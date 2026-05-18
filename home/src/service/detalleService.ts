const API_BASE = "https://electrohome-847j.onrender.com/api/pedidos";

export const crearPedidoCompleto = async (formData: any, carrito: any[]) => {
    try {
        // 1. Crear el pedido base (aquí va el nombre, email, etc.)
        const responsePedido = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData) 
        });

        if (!responsePedido.ok) throw new Error("Error al crear el pedido");
        const pedidoCreado = await responsePedido.json();
        const pedidoId = pedidoCreado.id;

        // 2. Agregar cada producto del carrito
        for (const item of carrito) {
            const urlProd = `${API_BASE}/${pedidoId}/productos?productoId=${item.id}&cantidad=${item.cantidad}`;
            const responseProd = await fetch(urlProd, { method: 'POST' });
            if (!responseProd.ok) console.error(`Error con producto ${item.id}`);
        }

        // 3. Confirmar el pedido final
        const responseConfirm = await fetch(`${API_BASE}/${pedidoId}/confirmar`, {
            method: 'PUT'
        });

        if (!responseConfirm.ok) throw new Error("Error al confirmar");
        
        return await responseConfirm.json();

    } catch (error) {
        console.error("Fallo en la compra:", error);
        throw error;
    }
};