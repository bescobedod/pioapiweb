const { Op } = require('sequelize');
const s3 = require('../../services/s3');
const CategoriaPublicacionModel = require('../../models/pioapp/tables/categoria_publicacion.model');
const vw_detalle_publicacion = require('../../models/pioapp/views/vw_detalle_publicacion.view');
const PublicacionModel = require('../../models/pioapp/tables/publicacion.model');
const PublicacionArchivoModel = require('../../models/pioapp/tables/publicacion_archivo.model');
const vw_usuario_publicacion = require('../../models/pioapp/views/vw_usuario_publicacion.view');
const { sequelize } = require('../../configuration/db');
const UserModel = require('../../models/pioapp/tables/users.model');
const UsuarioPublicacionesVistasModel = require('../../models/pioapp/tables/usuario_publicaciones_vistas.model');

const S3_BUCKET = process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_BUCKET_REGION;
const PUBLIC_BASE = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com`;

vw_detalle_publicacion.hasMany(PublicacionArchivoModel, { 
    foreignKey: 'id_publicacion', 
    sourceKey: 'id_publicacion',
    as: 'archivos' 
});

async function getAllCategoriasPublicacion(req, res) {
    try {
        const categorias = await CategoriaPublicacionModel.findAll({
            where: {
                estado: true
            },
            raw: true
        });
        return res.json(categorias);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Error al obtener las categorias de publicaciones',
            details: err.message
        });
    }
}

async function updateCategoriaById(req, res) {
    const {id_categoria} = req.params;
    const {
        nombre,
        color
    } = req.body;

    try {
        const categoria = await CategoriaPublicacionModel.findByPk(id_categoria);

        if(!categoria){
            return res.status(404).json({
                error: 'Categoría no encontrada'
            })
        }

        categoria.nombre = nombre;
        categoria.color = color;
        categoria.user_updated = req.user.id_user;

        await categoria.save()

        return res.json(categoria);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al actualizar la categoría',
            details: err.message
        })
    }
}

async function createCategoria(req, res) {
    const {nombre, color} = req.body;

    try {
        const categoriaExistente = await CategoriaPublicacionModel.findOne({
            where: {
                nombre: nombre
            }
        })

        if(categoriaExistente) {
            return res.json({
                error: 'Nombre de categoría ya existe'
            });
        }

        const nuevaCategoria = await CategoriaPublicacionModel.create({
            nombre,
            color,
            user_created: req.user.id_user,
            estado: true
        })

        return res.json(nuevaCategoria);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al crear una nueva categoría',
            details: err.message
        });
    }
}

async function deleteCategoriaById(req, res) {
    const { id_categoria } = req.params;

    try {
        const categoria = await CategoriaPublicacionModel.findByPk(id_categoria);

        if (!categoria) {
            return res.status(404).json({
                error: 'Categoría no encontrada'
            });
        }

        await categoria.destroy();

        return res.status(200).json({
            message: 'Categoría eliminada correctamente',
            id_eliminado: id_categoria
        });

    } catch (err) {
        if (err.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                error: 'No se puede eliminar: Esta categoría tiene publicaciones asociadas.'
            });
        }

        return res.status(500).json({
            error: 'Error al eliminar categoría',
            details: err.message
        });
    }
}

async function toggleCategoriaById(req, res) {
    const { id_categoria } = req.params;

    try {
        const categoria = await CategoriaPublicacionModel.findByPk(id_categoria);

        if(!categoria) {
            return res.status(404).json({ error: 'No se encontró la categoría' })
        }

        categoria.estado = !categoria.estado;

        await categoria.save();

        if(categoria.estado === false) {
            await PublicacionModel.update(
                { estado: false},
                {
                    where: {
                        id_categoria_publicacion: id_categoria,
                        estado: true
                    }
                }
            );
        }

        return res.json(categoria);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al inactivar la categoría',
            details: err.message
        });
    }
}

async function getAllPublicaciones(req, res) {
    try {
        const publicaciones = await vw_detalle_publicacion.findAll({
            include: [{ 
                model: PublicacionArchivoModel, 
                as: 'archivos',
                attributes: ['id_archivo_pub', 'nombre_archivo', 'tipo', 'url_archivo'] 
            }],
            order: [['createdAt', 'DESC']],
        });

        return res.json(publicaciones);
    } catch (err) {
        return res.status(500).json({ error: 'Error al obtener publicaciones', details: err.message });
    }
}

async function getArchivoUrl(req, res) {
    try {
        const { id_archivo_pub } = req.params;
        const archivo = await PublicacionArchivoModel.findByPk(id_archivo_pub);

        if (!archivo) return res.status(404).json({ error: 'Archivo no encontrado' });

        const url = await s3.getPresignedUrl({
            bucket: archivo.s3_bucket,
            key: archivo.s3_key
        });

        return res.json({ url_temporal: url });
    } catch (err) {
        return res.status(500).json({ error: 'Error al generar URL' });
    }
}

async function createPublicacion(req, res) {
    const { id_categoria_publicacion, titulo, mensaje, id_roles } = req.body;
    const t = await sequelize.transaction();
    let rolesParsed = typeof id_roles === 'string' ? JSON.parse(id_roles) : id_roles;

    if(!rolesParsed || !Array.isArray(rolesParsed) || rolesParsed.length === 0) {
        rolesParsed = [2, 4, 5];
    }

    try {
        const nuevaPublicacion = await PublicacionModel.create({
            id_categoria_publicacion,
            titulo,
            mensaje,
            estado: true,
            user_created: req.user.id_user,
            user_updated: req.user.id_user,
            id_roles: rolesParsed || []
        }, { transaction: t });

        const usuariosDestino = await UserModel.findAll({
            where: {
                id_rol: {
                    [Op.in]: rolesParsed
                }
            },
            attributes: ['id_users', 'division'],
            transaction: t
        });

        if (usuariosDestino.length > 0) {
            const vistasData = usuariosDestino.map(u => ({
                id_publicacion: nuevaPublicacion.id_publicacion,
                id_usuario: u.id_users,
                division: u.division,
                estado: 1
            }));

            await UsuarioPublicacionesVistasModel.bulkCreate(vistasData, { transaction: t });
        }

        const usersEmail = await UserModel.findAll({
            where: {
                [Op.or]: [
                    { id_users: req.user.id_user },
                    { id_rol: { [Op.in]: [7]} }
                ]
            },
            attributes: ['email'],
            raw: true
        });

        const emailsList = usersEmail.map(u => u.email).filter(Boolean).join(", ");

        const htmlBody = `
        <h1>SE HA CREADO LA PUBLICACIÓN ${nuevaPublicacion.id_publicacion}: ${nuevaPublicacion.titulo}</h1>
        <p>${nuevaPublicacion.mensaje}</p>
        <p style='color: red;'>Puedes ver todas las publicaciones creadas en: <a href="https://pioapp.pinulitogt.com/">https://pioapp.pinulitogt.com/</a></p>
        <hr>`;

        const basicAuth = Buffer
        .from(`${process.env.BASIC_NOTI_AUTH_USER}:${process.env.BASIC_NOTI_AUTH_PASS}`)
        .toString('base64');

        const emailNotification = await fetch(`https://services.sistemaspinulito.com/notificaciones/mail/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${basicAuth}`,
            },
            body: JSON.stringify({
                emisor: 'PIOAPP',
                email_receptor: emailsList,
                asunto: `AVISO PUBLICACIÓN CREADA: ${nuevaPublicacion.titulo}`,
                data_context: {
                    body: htmlBody
                }
            })
        });

        const email = await emailNotification.json();
            
        if(!emailNotification.ok){
            throw new Error(email.message);    
        }

        const usersNotificacion = usuariosDestino.map(u => Number(u.id_users))

        const movilNotification = await fetch(`https://services.sistemaspinulito.com/pioapi/notificaciones/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  Authorization: `Basic ${Buffer.from(
                    `${process.env.BASIC_AUTH_USER}:${process.env.BASIC_AUTH_PASS}`
                  ).toString('base64')}`
                },
                body: JSON.stringify({
                    user: usersNotificacion,
                    body: nuevaPublicacion.mensaje,
                    title: `${nuevaPublicacion.titulo}`,
                    id_asunto_notificacion: 1,
                    data_payload: { id_publicacion:  nuevaPublicacion.id_publicacion}
                })
            })

            const movil = await movilNotification.json();
            if(!movilNotification.ok){
                throw new Error(movil.message);
                
            }

        await t.commit();

        return res.json(nuevaPublicacion);
    } catch (err) {

        await t.rollback();
        return res.status(500).json({ error: 'Error al crear publicación', details: err.message });
    }
}

async function uploadArchivosPublicacion(req, res) {
    const { id_publicacion } = req.params;
    const S3_BUCKET = process.env.AWS_BUCKET_NAME;
    const REGION = process.env.AWS_BUCKET_REGION

    try {
        const pub = await PublicacionModel.findByPk(id_publicacion);
        if (!pub) return res.status(404).json({ error: 'Publicación no encontrada' });

        if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No hay archivos' });

        const resultados = [];
        for (const file of req.files) {
            const key = s3.buildS3KeyPublicacion({
                id_publicacion,
                originalName: file.originalname,
                mimeType: file.mimetype
            });

            await s3.uploadBufferToS3({
                bucket: S3_BUCKET,
                key,
                buffer: file.buffer,
                contentType: file.mimetype
            });

            const url_archivo = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

            let tipo = "image";
            if(file.mimetype === 'application/pdf') tipo = 'pdf';
            else if (file.mimetype.startsWith('video/')) tipo = 'video';

            const registro = await PublicacionArchivoModel.create({
                id_publicacion,
                s3_bucket: S3_BUCKET,
                s3_key: key,
                url_archivo: url_archivo,
                nombre_archivo: file.originalname,
                tipo: tipo,
                bytes: file.size,
                userCreatedAt: req.user.id_user
            });
            resultados.push(registro);
        }

        return res.json({ message: 'Archivos subidos', archivos: resultados });
    } catch (err) {
        return res.status(500).json({ error: 'Error al subir archivos', details: err.message });
    }
}

async function updatePublicacionById(req, res) {
    const { id_publicacion } = req.params;
    const {
        id_categoria,
        id_roles,
        titulo,
        mensaje
    } = req.body;

    try {
        const publicacion = await PublicacionModel.findByPk(id_publicacion);

        if(!publicacion) {
            return res.status(404).json({ error: 'No se encontró la publicación' });
        }

        publicacion.id_categoria = id_categoria,
        publicacion.id_roles = id_roles || [],
        publicacion.titulo = titulo,
        publicacion.mensaje = mensaje

        await publicacion.save();

        return res.json(publicacion);
    } catch (err) {
        return res.status(500).send({
            error: 'Error al actualizar publicación',
            details: err.message
        });
    }
}

async function togglePublicationById(req, res) {
    const { id_publicacion } = req.params;

    try {
        const publicacion = await PublicacionModel.findByPk(id_publicacion);

        if(!publicacion) {
            return res.status(404).json({ error: 'No se encontró la publicación' });
        }

        publicacion.estado = !publicacion.estado;

        publicacion.save();

        return res.json(publicacion);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al inactivar la publicación',
            details: err.message
        });
    }
}

async function getAllArchivos(req, res) {
    try {
        const archivos = await PublicacionArchivoModel.findAll({ raw: true });

        if(!archivos) {
            return res.status(404).json({ error: 'No se encontraron archivos' });
        }

        return res.json(archivos);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener los archivos de publicaciones',
            details: err.message
        });
    }
}

async function getArchivosByPublicacion(req, res) {
    const { id_publicacion } = req.params;

    try {
        const archivos = await PublicacionArchivoModel.findAll({
            where: {
                id_publicacion: id_publicacion
            },
            raw: true
        });

        if(!archivos) {
            return res.status(404).json({ error: 'No se encontraron archivos para esta publicación' });
        }

        return res.json(archivos);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener los archivos de la publicación',
            details: err.message
        });
    }
}

async function deleteArchivos(req, res) {
    const { id_archivos } = req.body;
    if (!id_archivos || !Array.isArray(id_archivos) || id_archivos.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron IDs de archivos válidos' });
    }

    try {
        const archivos = await PublicacionArchivoModel.findAll({
            where: { id_archivo_pub: id_archivos }
        });

        for (const archivo of archivos) {
            await s3.deleteFromS3({
                bucket: archivo.s3_bucket,
                key: archivo.s3_key
            })

            await archivo.destroy()
        }

        return res.json({
            message: 'Archivos Eliminados Correctamente',
            cantidad: archivos.length
        })
    } catch (err) {
        return res.status(500).json({
            error: 'No se pudo eliminar el contenido multimedia',
            details: err.message
        });
    }
}

async function getUsersViews(req, res) {
    const { id_publicacion } = req.params;

    try {
        const publicacion = await PublicacionModel.findByPk(id_publicacion);

        if(!publicacion) {
            return res.status(404).json({ error: 'No se encontró la publicación' });
        }

        const usuarios = await vw_usuario_publicacion.findAll({
            where: {
                id_publicacion
            },
            raw: true
        });



        return res.json(usuarios);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener información de usuarios por publicación',
            details: err.message
        });
    }
}

module.exports = {
    getAllCategoriasPublicacion,
    updateCategoriaById,
    createCategoria,
    deleteCategoriaById,
    toggleCategoriaById,
    getAllPublicaciones,
    getArchivoUrl,
    createPublicacion,
    uploadArchivosPublicacion,
    updatePublicacionById,
    togglePublicationById,
    getAllArchivos,
    getArchivosByPublicacion,
    deleteArchivos,
    getUsersViews
}