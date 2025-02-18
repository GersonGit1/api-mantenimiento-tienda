//validamos que el usuario esté autenticado para que pueda acceder a ciertas rutas
const verifySession = (req,res,next)=>{
    if(!req.session.user){
        return res.status(401).json({error: "No estás autenticado"});
    }
    next();
}

export default verifySession;