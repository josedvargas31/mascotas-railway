    //esta es ek pdf de la ficha tecnica de la mascota
    import PDFDocument from 'pdfkit';
    import fs from 'fs';
    import path from 'path';

    // Función para formatear las fechas
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Función para calcular la edad en meses
    const calculateAgeInMonths = (birthdate) => {
        const birth = new Date(birthdate);
        const now = new Date();

        const years = now.getFullYear() - birth.getFullYear();
        const months = now.getMonth() - birth.getMonth();

        return years * 12 + months;
    };



    export const generatePDF = async (mascota) => {
        const doc = new PDFDocument({
            size: 'A4',
            margins: { left: 50, right: 50 },
            info: {
                Title: `Ficha Técnica - ${mascota.nombre_mascota}`,
                Author: 'Tu Aplicación',
            }
        });

        // Crearemos un buffer donde almacenaremos el PDF.
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {});

        // Dibujar el margen alrededor de toda la página
        const margin = 50;
        const width = doc.page.width;
        const height = doc.page.height;

        doc
            .strokeColor('#dc7633')
            .lineWidth(1)
            .rect(margin, margin, width - 2 * margin, height - 2 * margin)
            .stroke();

            

// Ajusta estas constantes según cuánto quieras mover la imagen y el texto hacia la derecha y hacia abajo
const customOffsetX = 6; // Cambia este valor para mover la imagen hacia la derecha
const customOffsetY = 10; // Cambia este valor para mover la imagen hacia abajo
const customTextOffsetX = 4; // Cambia este valor para mover el texto "Purrfect Match" hacia la derecha
const customTextOffsetY = -5; // Cambia este valor para mover el texto "Purrfect Match" hacia arriba o hacia abajo

// Insertar una imagen en el PDF, ajustando la posición para que esté en la esquina superior izquierda del margen
const imagePath = path.resolve('uploads/img-1723413097559-796545287.png');

let imageHeight = 0;
if (fs.existsSync(imagePath)) {
    const img = doc.openImage(imagePath);
    imageHeight = img.height / img.width * 60; // Calcula la altura de la imagen ajustada

    doc.image(imagePath, {
        fit: [60, 60], // Ajusta el tamaño de la imagen
        align: 'center', // Alineación dentro del cuadro de imagen (opcional)
        valign: 'top',   // Alineación vertical dentro del cuadro de imagen (opcional)
        x: margin + customOffsetX, // Mueve la imagen hacia la derecha ajustando el margen izquierdo con customOffsetX
        y: margin + customOffsetY  // Mueve la imagen hacia abajo ajustando el margen superior con customOffsetY
    });

    // Agregar el texto "Purrfect Match" justo debajo de la imagen, con un ajuste horizontal y vertical adicional
    doc
        .fontSize(10)
        .fillColor('black')
        .font('Helvetica')
        .text('Purrfect Match', 
              margin + customOffsetX + customTextOffsetX, 
              margin + imageHeight + customOffsetY + customTextOffsetY); // Ajusta la posición del texto según la nueva posición de la imagen y el desplazamiento personalizado
} else {
    console.error('Archivo de imagen no encontrado:', imagePath);
}


// Insertar la imagen de la mascota con un borde alrededor
const mascotaImagePath = path.resolve('uploads', mascota.imagen); // Asegúrate de que el path sea correcto

if (fs.existsSync(mascotaImagePath)) {
    const img = doc.openImage(mascotaImagePath);

// Definir el tamaño personalizado de la imagen y el grosor del borde
const imageWidth = 170;
const imageHeight = 260;
const borderColor = 'black';
const borderWidth = 2; // Grosor del borde
const borderRadius = 4; // Radio de borde

// Posición de la imagen
let imageX = width - margin - imageWidth - borderWidth;
const imageY = margin + customOffsetY + 210;

// Ajuste personalizado de la posición horizontal de la imagen (más a la izquierda)
const customLeftAdjustment = 20; // Ajusta este valor según lo necesites
imageX -= customLeftAdjustment; // Mueve la imagen hacia la izquierda

// Dibujar el borde alrededor de la imagen
doc
    .lineWidth(borderWidth) // Grosor del borde
    .strokeColor(borderColor) // Color del borde
    .roundedRect(imageX - borderWidth / 2, imageY - borderWidth / 2, imageWidth + borderWidth, imageHeight + borderWidth, borderRadius)
    .stroke(); // Dibujar el rectángulo redondeado

// Dibuja la imagen de la mascota dentro del borde
doc.image(mascotaImagePath, {
    width: imageWidth,
    height: imageHeight,
    align: 'center',
    valign: 'top',
    x: imageX,
    y: imageY
});


} else {
    console.error('Archivo de imagen de mascota no encontrado:', mascotaImagePath);
}


    doc
        .fontSize(24)
        .fillColor('black')
        .font('Helvetica-Bold')
        .moveDown() // Espacio antes del texto
        .text('Ficha Técnica', {
            align: 'center',
            underline: true,
            y: 90 // Ajusta este valor según necesites
        });



        // Información básica de la mascota
        const fechaNacimiento = formatDate(mascota.fecha_nacimiento);
        const edadEnMeses = calculateAgeInMonths(mascota.fecha_nacimiento);

        const infoTitleStyle = {
            fontSize: 18,
            fillColor: 'black',
            font: 'Helvetica-Bold'
        };

        const infoTextStyle = {
            fontSize: 14,
            fillColor: 'black',
            lineGap: 8,
            font: 'Helvetica'
        };

        const infoTextStyle1 = {
            fontSize: 14,
            fillColor: 'white',
        };
// Ajusta estos valores para la posición y el tamaño de la tabla
const tableTop = margin + 200; // Posición vertical de la tabla
const tableLeft = margin + 30; // Posición horizontal de la tabla
const tableWidth = width - 2 * margin - 250; // Ancho de la tabla
const tableHeight = 300; // Altura de la tabla
const rowHeight = 30; // Altura de cada fila
const columnWidth = tableWidth / 2; // Ancho de cada columna

// Dibujar la tabla
doc
    .lineWidth(1)
    .strokeColor('black') // Color de las líneas de la tabla
    .rect(tableLeft, tableTop, tableWidth, tableHeight)
    .stroke();

// Dibujar la línea vertical en el medio de la tabla
doc
    .lineWidth(1)
    .moveTo(tableLeft + columnWidth, tableTop)
    .lineTo(tableLeft + columnWidth, tableTop + tableHeight)
    .stroke();

// Contenido de la tabla
const rows = [
    { field: 'Nombre', value: mascota.nombre_mascota },
    { field: 'Fecha de Nacimiento', value: formatDate(mascota.fecha_nacimiento) },
    { field: 'Edad', value: `${calculateAgeInMonths(mascota.fecha_nacimiento)} meses` },
    { field: 'Estado', value: mascota.estado },
    { field: 'Esterilizado', value: mascota.esterilizado },
    { field: 'Tamaño', value: mascota.tamano },
    { field: 'Peso', value: `${mascota.peso} kg` },
    { field: 'Categoría', value: mascota.nombre_categoria },
    { field: 'Raza', value: mascota.nombre_raza },
    { field: 'Ubicación', value: `${mascota.nombre_departamento}, ${mascota.nombre_municipio}` },
];

rows.forEach((row, index) => {
    const y = tableTop + 5 + (index * rowHeight); // Ajustar la posición vertical

    // Ajustar la posición vertical del texto para centrarlo
    const textY = y + (rowHeight / 2) - 5; // Ajustar el desplazamiento vertical

    doc
        .fontSize(12)
        .fillColor('black')
        .font('Helvetica')
        .text(row.field, tableLeft + 5, textY) // Ajustar la posición del texto del campo
        .text(row.value, tableLeft + columnWidth + 5, textY); // Ajustar la posición del texto del valor

    // Dibujar línea horizontal después de cada fila, excepto la última
    if (index < rows.length - 1) {
        doc
            .lineWidth(1)
            .moveTo(tableLeft, y + rowHeight)
            .lineTo(tableLeft + tableWidth, y + rowHeight)
            .stroke();
    }
});

// Dibujar el borde de la última fila
doc
    .lineWidth(1)
    .moveTo(tableLeft, tableTop + tableHeight)
    .lineTo(tableLeft + tableWidth, tableTop + tableHeight)
    .stroke();

// Posición inicial en el eje x para el texto
let xPositionTextoVacunas = 50; // Ajusta este valor para mover el texto hacia la izquierda o derecha
let yPositionTextoVacunas = doc.y + 20;
// Función para ajustar la posición x del título "Vacunas" y su información
function ajustarPosicionXTextoVacunas(nuevaPosicionX) {
    xPositionTextoVacunas = nuevaPosicionX;
}

// Llamada a la función para ajustar la posición del texto
ajustarPosicionXTextoVacunas(80); // Ejemplo: mueve el texto y la información a la posición 'x' 30

// Información de vacunas
doc
    .fontSize(infoTitleStyle.fontSize)
    .fillColor(infoTitleStyle.fillColor)
    .font(infoTitleStyle.font)
    .text('Vacunas', xPositionTextoVacunas, yPositionTextoVacunas, { underline: true }) // Se añade la coordenada x
    .moveDown();

mascota.vacunas.forEach(vacuna => {
    const fechaVacuna = formatDate(vacuna.fecha_vacuna);
    doc
        .fontSize(infoTextStyle.fontSize)
        .fillColor(infoTextStyle.fillColor)
        .font(infoTextStyle.font)
        .text(`- ${vacuna.enfermedad} (${fechaVacuna}): ${vacuna.estado}`, xPositionTextoVacunas) // Se añade la coordenada x
        .moveDown(0.5);
});

// Sección de descripción
doc
    .fontSize(infoTitleStyle.fontSize) // Mantener el mismo tamaño y estilo que "Vacunas"
    .fillColor(infoTitleStyle.fillColor)
    .font(infoTitleStyle.font)
    .text('Descripción:', xPositionTextoVacunas, doc.y + 20, { underline: true }) // Añadir el título "Descripción" con el mismo estilo que "Vacunas"
    .moveDown();

doc
    .fontSize(infoTextStyle.fontSize) // Estilo de la descripción similar al de las vacunas
    .fillColor(infoTextStyle.fillColor)
    .font(infoTextStyle.font)
    .text(`${mascota.descripcion}`, xPositionTextoVacunas) // Se añade la coordenada x
    .moveDown();

        doc
            .fontSize(infoTitleStyle.fontSize)
            .fillColor(infoTextStyle1.fillColor)
            .font(infoTitleStyle.font)
            .text('ㅤ', { underline: true })
            .moveDown(10);

// Pie de página
const fixedXPosition = 470; // Coordenada x fija para la imagen y el texto
const fixedYPosition = doc.page.height - 70; // Coordenada y fija para la imagen (ajusta este valor si es necesario)

// Agregar la imagen justo antes del texto
if (fs.existsSync(imagePath)) {
    doc.image(imagePath, {
        fit: [60, 60], // Ajusta el tamaño de la imagen
        align: 'center',
        valign: 'top',
        x: fixedXPosition,    // Coordenada x fija
        y: fixedYPosition - 60 // Coordenada y ajustada para estar justo arriba del texto
    });
} else {
    console.error('Archivo de imagen no encontrado:', imagePath);
}

// Agregar el texto 'Purrfect Match'
doc
    .fontSize(10)
    .fillColor('black')
    .font('Helvetica')
    .text('Purrfect Match', fixedXPosition, fixedYPosition); // Usa fixedXPosition y fixedYPosition para mantener la posición del texto fija

        doc.end();

        // Convertir el PDF a un buffer
        return new Promise((resolve, reject) => {
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
        });
    };
