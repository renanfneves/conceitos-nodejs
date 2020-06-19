const { isEmpty, isArray, isEqual, sortBy } = require("lodash");
const { uuid } = require("uuidv4");

let repositories = [];

const checkIfRepoExistis = id => repositories.some(rep => rep.id === id);

module.exports = {
  read(req, res){
    try {
      if(isEmpty(repositories)) {
        res.sendStatus(204);
        return;
      }
      
      res.json(repositories);

    } catch (error) {
      res.status(500).json({ error });
    }
  },

  create(req, res){
    try {
      const errors = [];

      const { title, url, techs } = req.body;

      if(isEmpty(title)) errors.push('title is required');
      if(isEmpty(url)) errors.push('url is required');
      if(isEmpty(techs) || !isArray(techs)) errors.push('Send atleast one tech');

      if(!isEmpty(errors)) {
          res.status(400).json({ message: errors.join(', ') });
          return;
      }

      const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0,
      };
      
      repositories.push(repository);
    
      res.status(201).json(repository);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  update(req, res){
    try {
      const { id } = req.params;
      const { title, url, techs } = req.body;

      const doesObjectExist = checkIfRepoExistis(id);

      if(!doesObjectExist) {
        res.status(400).json({ message: "Repository not found" });
        return;
      }

      if(!isEmpty(techs) && !isArray(techs)) {
        res.status(400).json({ message: "Techs must be an array" });
        return;
      }
      
      let repository = null;

      repositories.forEach(rep => {
        if (rep.id === id) {
          rep.title = !isEmpty(title) && !isEqual(title, rep.title) ? title : rep.title;
          rep.url = !isEmpty(url) && !isEqual(url, rep.url) ? url : rep.url;
          rep.techs =  !isEmpty(techs) && !isEqual(sortBy(techs), sortBy(rep.techs)) ? techs : rep.techs;

          repository = rep;
        }
      });

      res.status(200).send(repository);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  remove(req, res){
    try {
      const { id } = req.params;
      
      const doesObjectExist = checkIfRepoExistis(id);

      if(!doesObjectExist) {
        res.status(400).json({ message: "Project not found" });
        return;
      }

      repositories = repositories.filter(rep => {
        return rep.id !== id;
      });

      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  
  likeIt(req, res){
    try {
      const { id } = req.params;
      
      const doesObjectExist = checkIfRepoExistis(id);

      if(!doesObjectExist) {
        res.status(400).json({ message: "Project not found" });
        return;
      }

      let likes = 0;

      repositories.forEach(rep => {
        if (rep.id === id) {
          rep.likes++;
          
          likes = rep.likes;
        }
      });

      res.status(200).json({ likes });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};