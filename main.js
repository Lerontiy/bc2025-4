import { Command } from 'commander';
import http from 'http';
import { readFile } from 'fs/promises'; 
import { URL } from 'url';
import { XMLBuilder } from 'fast-xml-parser';

const program = new Command();
program
    .option('-i, --input [input]', 'Вхідний файл')
    .option('-h, --host [host]', 'Хост сервера')
    .option('-p, --port [port]', 'Порт сервера');
program.parse(process.argv);
const options = program.opts();

const INPUT_FILE = options.input;
const HOST = options.host;
const PORT = options.port;

//console.log(INPUT_FILE, PORT, HOST)

function check(var1) {
    return (!var1 || var1==true) 
}

if (check(INPUT_FILE) || check(PORT) || check(HOST)) {
    console.error('Помилка: Необхідно вказати усі обов\'язкові параметри (--input --host --port).');
    process.exit();
}

function processData(passengers, queryParams) {
    let result = passengers;
    
    if (queryParams.get('survived') === 'true') {
        result = result.filter(p => p.Survived === "1"); 
    }
    
    return result.map(p => {
        return {
            name: `${p.Name}`,
            age: queryParams.get('age') === 'true' ? `${p.Age}` : undefined,
            ticket: `${p.Ticket}`,
        };
    });
}

function buildXmlResponse(data) {
    //console.log(data); 

    const XML_OBJ = {
        passengers: {
            passenger: data,
        }
    };  

    //console.log(XML_OBJ);

    const builder = new XMLBuilder({});
    const xml_output = builder.build(XML_OBJ);

    //console.log(xml_output);

    return xml_output;
}

const server = http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url, `http://${HOST}:${PORT}`);
    const queryParams = requestUrl.searchParams;

    //console.log(queryParams);

    let passengers;

    try {
        const data = await readFile(INPUT_FILE, 'utf-8');
        passengers = JSON.parse(data);
    } catch (error) {
        res.end(`Cannot find input file.`); 
        return;
    }

    //console.log(typeof(passengers));

    const processedData = processData(passengers, queryParams);

    const xmlResponse = buildXmlResponse(processedData);

    res.writeHead(200, { 'Content-Type': 'application/xml' }); 
    res.end(xmlResponse);
});

server.listen(PORT, HOST, () => {
    console.log(`Сервер запущено: http://${HOST}:${PORT}`);
    console.log('Натисни Ctrl+C для зупинки.');
});
