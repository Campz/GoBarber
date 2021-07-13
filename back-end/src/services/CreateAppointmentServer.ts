import { startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";
import Appointment from "../models/Appointment";
import AppointmentRepository from  '../repositories/AppointmentsRepository';

import AppError from '../errors/AppError';

interface Request{
    provider_id: string;
    date: Date;
}

class CreateAppointmentServer{
    public async execute({ date, provider_id }: Request): Promise<Appointment>{
        const appointmentRepository = getCustomRepository(AppointmentRepository);

        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentRepository.findByDate(
            appointmentDate,
        );

        if(findAppointmentInSameDate){
            throw new AppError('This appointment is already booked');
        }

        const appointment = appointmentRepository.create({
            date,
            provider_id,
        });

        await appointmentRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentServer;
