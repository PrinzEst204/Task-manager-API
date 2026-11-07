import express, { type Express, type Request, type Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()//calling the env variable

const app: Express = express()//Creating the express application

app.use(express.json());

const port: number = Number(process.env.PORT) || 3000;


interface Tasks {
    "id":number;
   "title":string;
    "completed":boolean;
}

const tasks : Tasks[] = [
    {
        "id":1,
        "title": "Learn Node.js",
        "completed": false,
    },
    {
        "id": 2,
        "title": "Build REST API",
        "completed": false,
},
]
let nextId = 3


app.get('/tasks', (req:Request, res:Response) => {
       res.json(tasks)
})


//introducing route parameters
app.get('/tasks/:id', (req:Request, res:Response) => {
    const id = Number(req.params.id);

    if(Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid task id"})
    }

    const task = tasks.find( (t) => t.id === id );

    if (!task) {
        return res.status(404).json({ message: "Task not found"});
    }
    res.json(task)
});


app.post('/tasks', (req:Request, res:Response) => {
    const { title } = req.body;

    //simple validation
    if (!title || typeof title !== "string" || !title.trim()){
        return res.status(400).json({ message: "Title is required"})
    }
    const newTasks : Tasks = {
        id: nextId++,
        title: title.trim(),
        completed: false,
    };

    tasks.push(newTasks);
    res.status(201).json(tasks)
})



//read / edit / update / data
app.patch('/tasks/:id', (req:Request, res:Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid task id"})
    }

    const task = tasks.find( (t) => t.id === id);

    if (!task) {
        return res.status(404).json({message: "Task not found"})
    }

    const { title, completed } = req.body;

    if (title === undefined && completed === undefined) {
        return res.status(400).json({ message: "Provide title or completed to update" })
    }

    if (title !== undefined) {
        if (typeof title !== "string"|| !title.trim()) {
            return res.status(400).json({ message: "Title must be a non-empty string" })
        }
    }

    if (completed !== undefined && typeof completed !== "boolean") {
        return res.status(400).json({ message: "Completed must be true or false" })
    }

    if (title !== undefined) task.title = title.trim();
    if (completed !== undefined) task.completed = completed

    res.json(task);
})

//Delete data
app.delete('/tasks/:id', (req: Request, res:Response) => {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
        return res.status(400).json({message: "Invalid task id" });
    }

    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1 ) {
        return res.status(404).json({message: "Task not found" })
    }

    const [deletedTask] = tasks.splice(index, 1)

    res.json(deletedTask)
});


 app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
