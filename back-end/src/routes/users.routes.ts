import { Router } from "express";
import CreateUserService from "../services/CreateUserService";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import multer from "multer";
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from "../services/UpdateUserAvatarService";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) =>{

        const { name, email, password } = request.body;

        const createUserService = new CreateUserService();

        const user = await createUserService.execute({
            name,
            email,
            password,
        })

        delete user.password;

        return response.json(user);
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {

            const updateUserAvatarService = new UpdateUserAvatarService();

            const user = await updateUserAvatarService.execute({
                user_id: request.user.id,
                avatarFilename: request.file.filename,
            });

            delete user.password;

            return response.status(200).json(user);

});

export default usersRouter;
