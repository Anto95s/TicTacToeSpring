<h1>Getting Started</h1>

Start Docker:

```
docker run -it --name tictactoesql -e MYSQL_ROOT_PASSWORD=admin -p 3306:3306 mysql
```

Run:

```
cd frontend
npm install
npm run start
```

If you want to install the used npm packages:

```
npm install @mui/material @emotion/react @emotion/styled
```

```
npm install react-json-to-table
```