import { Command } from 'commander';
import http from 'http';
import {readFileSync, writeFileSync} from 'fs';

const program = new Command();

program.option('-i, --input [input]', 'Вхідний файл');
program.option('-h, --host [host]', 'Хост');
program.option('-p, --port [port]', 'Порт');

program.parse(process.argv);
const options = program.opts();

const input = options.input;
const host = options.host;
const port = options.port;

// console.log(port)

function check(var1) {
    return (!var1 || var1==true)
}

if (check(input) || check(host) || check(port)) {
    console.log('Введи усі обов\'язкові параметри.');
    process.exit();
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Hello from Node.js Server!\nHost: ${host}, Port: ${port}`);
});

server.listen(port, host, () => {
  console.log(`Сервер запущено: http://${host}:${port}`);
  console.log('Натисніть Ctrl+C для зупинки.');
});
