var mysql = require("mysql");
var inquirer = require("inquirer");
const util = require("util")

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "PzW0Q^BG",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    querySearch();
});

function querySearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add Employee",
                "Add Role",
                "Add Department",
                "View Employee",
                "View Role",
                "View Department",
                "Update an employee's role",
                "Fire Employee",
                "Delete Role",
                "Remove Department",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add Employee":
                    addEmployee();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                case "View Employee":
                    viewEmployee();
                    break;

                case "View Role":
                    viewRole();
                    break;

                case "View Department":
                    viewDepartment();
                    break;

                case "Fire Employee":
                    fireEmployee();
                    break;

                case "Delete Role":
                    deleteRole();
                    break;

                case "Remove Department":
                    removeDepartment();
                    break;

                case "Update an employee's role":
                    updateEmployee();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

 function getId(array, table, answer) {
    connection.query("SELECT * FROM ??", [table], function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            if (answer.name === res[i].title) {
                array.push(res[i].id)
            }
            console.log(array)
        }
        return array
    })
}

const promiseId = util.promisify(getId)

function addEmployee() {
    inquirer
        .prompt([
            {
                name: "first",
                type: "input",
                message: "What is your employee's first name?"
            },
            {
                name: "last",
                type: "input",
                message: "What is your employee's last name?"
            },
            {
                name: "role",
                type: "input",
                message: "What is your employee's role?"
            },
            {
                name: "department",
                type: "input",
                message: "What is your employee's department?"
            },
        ])
        .then(function (answer) {
            const idArray = []
            const departmentArray = []
            console.log("console logging")
            promiseId(idArray, "role", answer)
            .then(function(){ promiseId(departmentArray, "department", answer)
        })
                .then(function (arr) {
                    console.log(arr)
                    var queryEmployee = "INSERT INTO employee SET ?";
                    connection.query(queryEmployee, { first_name: answer.first, last_name: answer.last, role_id: idArray[0], department_id: 1 }, function (err, res) {
                        if (err) throw err;
                        querySearch();
                    });
                })

        });
}

function addRole() {
    inquirer
        .prompt([
            {
                name: "role",
                type: "input",
                message: "What role would you like to add?"
            },
            {
                name: "salary",
                type: "input",
                message: "How much money will this job title make in a year?"
            },
        ])
        .then(function (answer) {
            var queryRole = "INSERT INTO role SET ?";
            connection.query(queryRole, { title: answer.role, salary: answer.salary, department_id: 1 }, function (err, res) {
                if (err) throw err;
                querySearch();
            });
        });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What department would you like to add?"
            }
        ])
        .then(function (answer) {
            var queryDepartment = "INSERT INTO department (name) VALUES (?)";
            connection.query(queryDepartment, [answer.name], function (err, res) {
                if (err) throw err;
                querySearch();
            });
        });
}

function fireEmployee() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "list",
                message: "Who would you like to let go?",
                choices: employeeArray
            }
        ])
        .then(function (answer) {
            var queryEmployee = "DELETE FROM employee WHERE ?";
            connection.query(queryEmployee, [{ id: answer.id }], function (err, res) {
                if (err) throw err;
                querySearch();
            });
        });
}

function deleteRole() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the id of the role you would like to delete?"
            }
        ])
        .then(function (answer) {
            var queryRole = "DELETE FROM role WHERE ?";
            connection.query(queryRole, [{ id: answer.id }], function (err, res) {
                if (err) throw err;
                querySearch();
            });
        });
}

function removeDepartment() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the id of the department you would like to remove?"
            }
        ])
        .then(function (answer) {
            var queryDepartment = "DELETE FROM department WHERE ?";
            connection.query(queryDepartment, [{ id: answer.id }], function (err, res) {
                if (err) throw err;
                querySearch();
            });
        });
}

function viewEmployee() {

    var queryEmployee = `SELECT first_name, last_name, title, salary, name
    FROM employee
    INNER JOIN role 
    ON employee.role_id = role.id
    INNER JOIN department
    ON employee.department_id = department.id`;
    connection.query(queryEmployee, function (err, res) {
        if (err) throw err;
        console.log(res)
        querySearch();
    });


}

function viewRole() {

    var queryRole = `SELECT * FROM role`;
    connection.query(queryRole, function (err, res) {
        if (err) throw err;
        console.log(res)
        querySearch();
    });

}

function viewDepartment() {

    var queryDepartment = "SELECT * FROM department";
    connection.query(queryDepartment, function (err, res) {
        if (err) throw err;
        console.log(res)
        querySearch();
    });

}

