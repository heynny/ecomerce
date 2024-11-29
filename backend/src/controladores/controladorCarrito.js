const Carrito = require('../modelos/carrito');
const Producto = require('../modelos/producto');


exports.crearCarrito = async (req, res) => {
    const { usuario_id, productos } = req.body;
    try {
        const productosIds = productos.map(p => p.producto);
        const productosValidos = await Producto.find({ _id: { $in: productosIds } });
        if (productosValidos.length !== productosIds.length) {
            return res.status(400).json({ mensaje: 'Uno o más productos no son válidos' });
        }

        const nuevoCarrito = new Carrito({
            usuario_id,
            productos
        });
        await nuevoCarrito.save();
        res.status(201).json({ mensaje: 'Carrito creado', carrito: nuevoCarrito });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el carrito', error: error.message });
    }
};

exports.obtenerCarrito = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const carrito = await Carrito.findOne({ usuario_id }).populate('productos.producto');
        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }
        res.status(200).json(carrito);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el carrito', error: error.message });
    }
};


exports.actualizarCarrito = async (req, res) => {
    const { usuario_id, productos } = req.body;
    try {
        const productosIds = productos.map(p => p.producto);
        const productosValidos = await Producto.find({ _id: { $in: productosIds } });
        if (productosValidos.length !== productosIds.length) {
            return res.status(400).json({ mensaje: 'Uno o más productos no son válidos' });
        }

        const carritoActualizado = await Carrito.findOneAndUpdate(
            { usuario_id },
            { productos },
            { new: true }
        );
        if (!carritoActualizado) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }
        res.status(200).json({ mensaje: 'Carrito actualizado', carrito: carritoActualizado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el carrito', error: error.message });
    }
};


exports.eliminarCarrito = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const carritoEliminado = await Carrito.findOneAndUpdate(
            { usuario_id },
            { productos: [] },
            { new: true }
        );
        if (!carritoEliminado) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }
        res.status(200).json({ mensaje: 'Carrito vacío', carrito: carritoEliminado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el carrito', error: error.message });
    }
};