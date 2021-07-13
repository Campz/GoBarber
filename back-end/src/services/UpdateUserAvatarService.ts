import { getRepository} from 'typeorm';
import uploadConfig from '../config/upload';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import { fromString } from 'uuidv4';
import AppError from '../errors/AppError';

interface Request {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService{
    public async execute({ user_id, avatarFilename}: Request): Promise<User> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id);

        if (!user) {
            throw new AppError('Only authenticated users can change avatar.', 401);
        }

        // Caso o usuário ja tenha um avatar
        if(user.avatar){

            // Verifica se o arquivo existe no sitema de arquivos
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            // Deleta o arquivo antigo para atualizar com um novo
            if (userAvatarFileExists){
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        //Atualiza o usuário no banco
        await usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
