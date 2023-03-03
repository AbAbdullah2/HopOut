import mongoose from "mongoose";
import ApiError from "../models/ApiError.js";
import { z } from "zod";
import Event from "../models/Event.js";
import User from "../models/User.js";

const validObjectId = z
  .string()
  .refine((id) => mongoose.isValidObjectId(id), "Invalid ID!");
const validString = z.string().min(1, "Missing attribute!");
const validDate = z.string().datetime("Invalid Date!");
const visibilityEnum = z.enum(["public", "private"]);

class EventDao {

  // return the created event
  async create({ name, start, end, location, description, visibility, organizer, categories }) {
    
    //check name is valid
    let result = validString.safeParse(name);
    if (!result.success) {
      throw new ApiError(400, "Invalid Name!");
    }

    //check start is valid
    //NOTE:also check that start date is before end date
    result = validDate.safeParse(start);
    if (!result.success) {
      throw new ApiError(400, "Invalid Start Date!");
    }
  
    //check end is valid
    result = validDate.safeParse(end);
    if (!result.success) {
      throw new ApiError(400, "Invalid End Date!");
    }

    // MAY HAVE TO VALIDATE A DIFFERENT WAY LATER
    result = validString.safeParse(location);
    if (!result.success) {
      throw new ApiError(400, "Invalid Location!");
    }

    //check description is valid
    result = validString.safeParse(description);
    if (!result.success) {
      throw new ApiError(400, "Invalid Description!");
    }

    //check visibility is valid
    //CHECK IF PARSE IS CORRECT LATER
    result = visibilityEnum.safeParse(visibility);
    if (!result.success) {
      throw new ApiError(400, "Invalid visibility!");
    }

    //check organizer ID is valid
    result = validObjectId.safeParse(organizer);
    if (!result.success) {
      throw new ApiError(400, "Invalid Organizer ID!");
    }

    //check Organizer is valid
    try {
      User.findById(organizer);
    } catch(e) {
      throw new ApiError(400, "Invalid Organizer!");
    }

    //check categories array has valid categories
    categories.forEach((t) => { 
      result = validString.safeParse(t);
      if (!result.success) {
        throw new ApiError(400, "Invalid Tag in categories array!");
      }
    })

    //create event
    const event = await Event.create({ name, start, end, location, description, visibility, organizer, categories, 
        attendees: [], invitees: [], coverId: "", thumbnailId: "" });
    
    return event;
  }

  // return all events
  async readAll() {
    const events = await Event.find();
    return events;
  }

  // return the event with the given ID
  // throws ApiError if id is invalid or resource does not exist in our database
  async read(id) {
    //validate id 
    const result = validObjectId.safeParse(id);
    if (!result.success) {
      throw new ApiError(400, "Invalid ID!");
    }

    //find event
    const event = await Event.findById(id);
    if (!event) {
      throw new ApiError(404, "Resource not found!");
    }

    return event;
  }

  // update an event given its ID
  // return the updated event
  // throws ApiError if id is invalid or resource does not exist in our database
  async update({ id, name, start, end, location, description, visibility, categories, attendees, invitees, coverId, thumbnailId }) {

    //validate id
    let result = validObjectId.safeParse(id);
    if (!result.success) {
      throw new ApiError(400, "Invalid ID!");
    }

    //validate name
    if (name !== undefined) {
      result = validString.safeParse(name);
      if (!result.success) {
        throw new ApiError(400, "Invalid Name!");
      }
    }

    //check start is valid
    //NOTE for LATER: also check that start date is before end date
    if (start !== undefined) {
      result = validDate.safeParse(start);
      if (!result.success) {
        throw new ApiError(400, "Invalid Start Date!");
      }
    }

    //check end is valid
    if (end !== undefined) {
      result = validDate.safeParse(end);
      if (!result.success) {
        throw new ApiError(400, "Invalid End Date!");
      }
    }

    //check location is valid
    // MAY HAVE TO VALIDATE A DIFFERENT WAY LATER
    if (location !== undefined) {
      result = validString.safeParse(location);
      if (!result.success) {
        throw new ApiError(400, "Invalid Location!");
      }
    }

    if (description !== undefined) {
      //check description is valid
      result = validString.safeParse(description);
      if (!result.success) {
        throw new ApiError(400, "Invalid Description!");
      }
    }

    //check visibility is valid
    //CHECK IF PARSE IS CORRECT LATER
    if (visibility !== undefined) {
      result = visibilityEnum.safeParse(visibility);
      if (!result.success) {
        throw new ApiError(400, "Invalid visibility!");
      }
    }

    //check categories array has valid categories
    if (categories !== undefined) {
      categories.forEach((t) => { 
        result = validString.safeParse(t);
        if (!result.success) {
          throw new ApiError(400, "Invalid Tag in categories array!");
        }
      })
    }

    //check attendees list has valid attendees
    if (attendees !== undefined) {
      attendees.forEach((user) => { 
        try {
          User.findById(user.id);
        } catch (e) {
          throw new ApiError(400, "Invalid Attendee in attendees list!");
        }
      })
    }

    //check invitees list has valid attendees
    if (invitees !== undefined) {
      invitees.forEach((user) => { 
        try {
          User.findById(user.id);
        } catch (e) {
          throw new ApiError(400, "Invalid Invitee in invitee list!");
        }
      })
    }

    //update event
    const event = await Event.findByIdAndUpdate(
      id,
      { name, start, end, location, description, visibility, categories, attendees, invitees, coverId, thumbnailId },
      { new: true }
    );
    if (!event) {
      throw new ApiError(404, "Resource not found!");
    }

    return event;
  }

  // delete an event given its ID
  // return the event 
  // throws ApiError if id is invalid or resource does not exist
  async delete(id) {

    //validate id 
    const result = validObjectId.safeParse(id);
    if (!result.success) {
      throw new ApiError(400, "Invalid ID!");
    }

    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      throw new ApiError(404, "Resource not found!");
    }

    return event;
  }
}

export default EventDao;
