// controllers/reporteController.js
import { pool } from "../database/conexion.js";
import ExcelJS from "exceljs";

// Función para generar el archivo Excel
const generateExcel = (data) => {
	return new Promise((resolve, reject) => {
		try {
			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet("Mascotas en Adopción");

			const borderStyle = {
				top: { style: "thin" },
				left: { style: "thin" },
				bottom: { style: "thin" },
				right: { style: "thin" },
			};

			const headerStyle = {
				font: { bold: true, color: { argb: "FFFFFF" } },
				fill: {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "4F81BD" },
				},
				alignment: { horizontal: "center", vertical: "middle" },
				border: borderStyle,
			};

			const cellStyle = {
				alignment: { vertical: "middle", wrapText: true },
				border: borderStyle,
			};

			// Definir encabezados de la hoja de cálculo
			worksheet.columns = [
				{ header: "Nombre de Mascota", key: "nombre_mascota", width: 30 },
				{ header: "Fecha de Nacimiento", key: "fecha_nacimiento", width: 20 },
				{ header: "Edad (meses)", key: "edad", width: 15 },
				{ header: "Estado", key: "estado", width: 15 },
				{ header: "Esterilizado", key: "esterilizado", width: 15 },
				{ header: "Tamaño", key: "tamano", width: 15 },
				{ header: "Peso", key: "peso", width: 15 },
				{ header: "Categoría", key: "nombre_categoria", width: 20 },
				{ header: "Raza", key: "nombre_raza", width: 20 },
				{ header: "Departamento", key: "nombre_departamento", width: 20 },
				{ header: "Municipio", key: "nombre_municipio", width: 20 },
				{ header: "Descripción", key: "descripcion", width: 50 },
			];

			worksheet.getRow(1).eachCell((cell) => {
				cell.style = headerStyle;
			});

			// Calcular la edad en meses
			const calculateAgeInMonths = (birthdate) => {
				const birth = new Date(birthdate);
				const now = new Date();

				const years = now.getFullYear() - birth.getFullYear();
				const months = now.getMonth() - birth.getMonth();

				return years * 12 + months;
			};

			// Agregar filas de datos
			data.forEach((mascota) => {
				worksheet.addRow({
					nombre_mascota: mascota.nombre_mascota,
					fecha_nacimiento: mascota.fecha_nacimiento,
					edad: calculateAgeInMonths(mascota.fecha_nacimiento),
					estado: mascota.estado,
					esterilizado: mascota.esterilizado,
					tamano: mascota.tamano,
					peso: mascota.peso,
					nombre_categoria: mascota.nombre_categoria,
					nombre_raza: mascota.nombre_raza,
					nombre_departamento: mascota.nombre_departamento,
					nombre_municipio: mascota.nombre_municipio,
					descripcion: mascota.descripcion,
				});
			});

			// Convertir el workbook a un buffer
			workbook.xlsx.writeBuffer().then((buffer) => {
				resolve(buffer);
			});
		} catch (error) {
			reject(error);
		}
	});
};

// Controlador para generar el reporte
export const generarReporteAdoptadosEXCEL = async (req, res) => {
	try {
		const { tipo_fecha, fecha_inicio, fecha_fin, categoria, raza, id_mascota } =
			req.query;

		// Validación de parámetros
		if (
			!tipo_fecha ||
			(tipo_fecha === "rango" && (!fecha_inicio || !fecha_fin))
		) {
			return res.status(400).json({
				status: 400,
				message: "Parámetros de fecha insuficientes",
			});
		}

		let query = `
    SELECT 
        m.id_mascota,
        m.nombre_mascota, 
        m.fecha_nacimiento, 
        r.nombre_raza,
        c.nombre_categoria, 
        m.estado,
        m.esterilizado,
        m.tamano,
        m.peso,
        m.descripcion, 
        mu.nombre_municipio,
        d.nombre_departamento,
        u.nombre AS nombre_usuario_adoptante, 
        u.apellido AS apellido_usuario_adoptante
    FROM 
        mascotas m
    INNER JOIN 
        razas r ON m.fk_id_raza = r.id_raza
    INNER JOIN 
        categorias c ON r.fk_id_categoria = c.id_categoria  
    INNER JOIN 
        municipios mu ON m.fk_id_municipio = mu.id_municipio
    INNER JOIN 
        departamentos d ON mu.fk_id_departamento = d.id_departamento  
    LEFT JOIN 
        adopciones a ON m.id_mascota = a.fk_id_mascota
    LEFT JOIN 
        usuarios u ON a.fk_id_usuario_adoptante = u.id_usuario
    WHERE 
        m.estado = 'Adoptado'
        `;
		let params = [];

		// Filtrar por ID de mascota
		if (id_mascota) {
			query += " AND m.id_mascota = ?";
			params.push(id_mascota);
		}

		if (tipo_fecha === "dia") {
			query += " AND DATE(m.fecha_nacimiento) = ?";
			params.push(fecha_inicio);
		} else if (tipo_fecha === "mes") {
			query +=
				" AND MONTH(m.fecha_nacimiento) = ? AND YEAR(m.fecha_nacimiento) = ?";
			const [mes, año] = fecha_inicio.split("-");
			params.push(mes, año);
		} else if (tipo_fecha === "rango") {
			query += " AND DATE(m.fecha_nacimiento) BETWEEN ? AND ?";
			params.push(fecha_inicio, fecha_fin);
		}

		// Filtrar por raza
		if (raza) {
			query += " AND r.id_raza = ?";
			params.push(raza);
		}

		const [mascotas] = await pool.query(query, params);

		if (mascotas.length === 0) {
			return res.status(404).json({
				status: 404,
				message: "No se encontraron mascotas con los filtros proporcionados",
			});
		}

		// Obtener las vacunas y una imagen para cada mascota
		for (let mascota of mascotas) {
			const [vacunas] = await pool.query(
				`
        SELECT enfermedad, estado, fecha_vacuna
        FROM vacunas 
        WHERE fk_id_mascota = ?
      `,
				[mascota.id_mascota]
			);

			mascota.vacunas = vacunas; // Agregar las vacunas a la mascota

			const [imagenesResult] = await pool.query(
				`
        SELECT ruta_imagen 
        FROM imagenes 
        WHERE fk_id_mascota = ?
        LIMIT 1
      `,
				[mascota.id_mascota]
			);

			mascota.imagen =
				imagenesResult.length > 0 ? imagenesResult[0].ruta_imagen : null;
		}

		// Generar el EXCEL
		const excelBuffer = await generateExcel(mascotas);

		// Configurar las cabeceras para la descarga del archivo Excel
		res.setHeader(
			"Content-Disposition",
			`attachment; filename=Reporte_Mascotas_${Date.now()}.xlsx`
		);
		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);

		res.send(excelBuffer);
	} catch (error) {
		console.error("Error al generar el reporte:", error);
		res.status(500).json({
			status: 500,
			message: "Error en el servidor: " + error.message,
		});
	}
};
