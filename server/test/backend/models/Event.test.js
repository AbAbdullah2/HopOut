import { describe, beforeAll, afterAll, expect, it, vi } from "vitest";
import Event from "../../../src/models/Event.js";
import { faker } from "@faker-js/faker";
import * as db from "../../../src/data/db.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

describe("Test Event Schema & Model", () => {
  beforeAll(async () => {
    db.connect(process.env.TEST_DB);
    await Event.deleteMany({});
  });

  it("test create event", async () => {
    const name = faker.lorem.words(3);
    const start = faker.date.future(1);
    const end = faker.date.soon(1, start);
    const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    const description = faker.lorem.paragraph();
    const visibility = "private";
    const organizer = mongoose.Types.ObjectId();
    const categories = ["Sports"];
    const event = await Event.create({ name, start, end, location, description, visibility, organizer, categories });
    expect(event.name).toBe(name);
    expect(event.start).toBe(start);
    expect(event.end).toBe(end);
    expect(event.location).toBe(location);
    expect(event.description).toBe(description);
    expect(event.visibility).toBe(visibility)
    expect(event.organizer).toBe(organizer);
    expect(event.categories).toStrictEqual(categories);
  });

  // it("test create event with default visibility", async () => {
  //   const name = faker.lorem.words(3);
  //   const start = faker.date.future(1);
  //   const end = faker.date.soon(1, start);
  //   const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
  //   const description = faker.lorem.paragraph();
  //   const organizer = mongoose.Types.ObjectId();
  //   const categories = ["Sports"];
  //   const event = await Event.create({ name, start, end, location, description, organizer, categories });
  //   expect(event.name).toBe(name);
  //   expect(event.start).toBe(start);
  //   expect(event.end).toBe(end);
  //   expect(event.location).toBe(location);
  //   expect(event.description).toBe(description);
  //   //expect(event.visibility).toBe(visibility);
  //   expect(event.organizer).toBe(organizer);
  //   expect(event.categories).toStrictEqual(categories);
  // });

  describe("test name is required", () => {
    it("test name is null", async () => {
      try {
        const name = null;
        const start = faker.date.future(1);
        const end = faker.date.soon(1, start);
        const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
        const description = faker.lorem.paragraph();
        const visibility = "private";
        const organizer = mongoose.Types.ObjectId();
        const categories = ["Sports"];
        await Event.create({ name, start, end, location, description, visibility, organizer, categories });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test name is undefined", async () => {
      try {
        const name = undefined;
        const start = faker.date.future(1);
        const end = faker.date.soon(1, start);
        const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
        const description = faker.lorem.paragraph();
        const visibility = "private";
        const organizer = mongoose.Types.ObjectId();
        const categories = ["Sports"];
        await Event.create({ name, start, end, location, description, visibility, organizer, categories });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test name is empty", async () => {
      try {
        const name = null;
        const start = faker.date.future(1);
        const end = faker.date.soon(1, start);
        const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
        const description = faker.lorem.paragraph();
        const visibility = "private";
        const organizer = mongoose.Types.ObjectId();
        const categories = ["Sports"];
        await Event.create({ name, start, end, location, description, visibility, organizer, categories });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe("test start is required", () => {
    it("test start is null", async () => {
      try {
        const name = faker.lorem.words(3);
        const start = null;
        const end = faker.date.soon(1, start);
        const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
        const description = faker.lorem.paragraph();
        const visibility = "private";
        const organizer = mongoose.Types.ObjectId();
        const categories = ["Sports"];
        await Event.create({ name, start, end, location, description, visibility, organizer, categories });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test start is undefined", async () => {
      try {
        const name = faker.lorem.words(3);
        const start = undefined;
        const end = faker.date.soon(1, start);
        const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
        const description = faker.lorem.paragraph();
        const visibility = "private";
        const organizer = mongoose.Types.ObjectId();
        const categories = ["Sports"];
        await Event.create({ name, start, end, location, description, visibility, organizer, categories });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test start is empty", async () => {
      try {
        const name = faker.lorem.words(3);
        const start = "";
        const end = faker.date.soon(1, start);
        const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
        const description = faker.lorem.paragraph();
        const visibility = "private";
        const organizer = mongoose.Types.ObjectId();
        const categories = ["Sports"];
        await Event.create({ name, start, end, location, description, visibility, organizer, categories });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    // it("test start is in past", async () => {
    //   try {
    //     const name = faker.lorem.words(3);
    //     const start = faker.date.past(1);
    //     const end = faker.date.soon(1, start);
    //     const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //     const description = faker.lorem.paragraph();
    //     const visibility = "private";
    //     const organizer = mongoose.Types.ObjectId();
    //     const categories = ["Sports"];
    //     await Event.create({ name, start, end, location, description, visibility, organizer, categories });
    //   } catch (err) {
    //     expect(err).toBeDefined();
    //   }
    // });

    // it("test start after end", async () => {
    //   try {
    //     const name = faker.lorem.words(3);
    //     const end = faker.date.soon(1);
    //     const start = faker.date.soon(1, end);
    //     const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //     const description = faker.lorem.paragraph();
    //     const visibility = "private";
    //     const organizer = mongoose.Types.ObjectId();
    //     const categories = ["Sports"];
    //     await Event.create({ name, start, end, location, description, visibility, organizer, categories });
    //   } catch (err) {
    //     expect(err).toBeDefined();
    //   }
    // });

    it("test start is invalid", async () => {
      try {
        const name = faker.lorem.words(3);
        const start = faker.lorem.words(3);
        const end = faker.date.soon(1, start);
        const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
        const description = faker.lorem.paragraph();
        const visibility = "private";
        const organizer = mongoose.Types.ObjectId();
        const categories = ["Sports"];
        await Event.create({ name, start, end, location, description, visibility, organizer, categories });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

    describe("test end is required", () => {
      it("test end is null", async () => {
        try {
          const name = faker.lorem.words(3);
          const start = faker.date.soon(1);
          const end = null;
          const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
          const description = faker.lorem.paragraph();
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const categories = ["Sports"];
          await Event.create({ name, start, end, location, description, visibility, organizer, categories });
        } catch (err) {
          expect(err).toBeDefined();
        }
      });
  
      it("test end is undefined", async () => {
        try {
          const name = faker.lorem.words(3);
          const start = faker.date.soon(1);
          const end = undefined;
          const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
          const description = faker.lorem.paragraph();
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const categories = ["Sports"];
          await Event.create({ name, start, end, location, description, visibility, organizer, categories });
        } catch (err) {
          expect(err).toBeDefined();
        }
      });
  
      it("test end is empty", async () => {
        try {
          const name = faker.lorem.words(3);
          const start = faker.date.soon(1);
          const end = "";
          const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
          const description = faker.lorem.paragraph();
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const categories = ["Sports"];
          await Event.create({ name, start, end, location, description, visibility, organizer, categories });
        } catch (err) {
          expect(err).toBeDefined();
        }
      });
  
      // it("test end is in past", async () => {
      //   try {
      //     const name = faker.lorem.words(3);
      //     const start = faker.date.soon(1);
      //     const end = faker.date.past(1);
      //     const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
      //     const description = faker.lorem.paragraph();
      //     const visibility = "private";
      //     const organizer = mongoose.Types.ObjectId();
      //     const categories = ["Sports"];
      //     await Event.create({ name, start, end, location, description, visibility, organizer, categories });
      //   } catch (err) {
      //     expect(err).toBeDefined();
      //   }
      // });

      //it("test end before start", async () => {
        //   try {
        //     const name = faker.lorem.words(3);
        //     const end = faker.date.soon(1);
        //     const start = faker.date.soon(1, end);
        //     const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
        //     const description = faker.lorem.paragraph();
        //     const visibility = "private";
        //     const organizer = mongoose.Types.ObjectId();
        //     const categories = ["Sports"];
        //     await Event.create({ name, start, end, location, description, visibility, organizer, categories });
        //   } catch (err) {
        //     expect(err).toBeDefined();
        //   }
        // });
  
      it("test end is invalid", async () => {
        try {
          const name = faker.lorem.words(3);
          const start = faker.date.soon(1);
          const end = faker.lorem.words(3);
          const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
          const description = faker.lorem.paragraph();
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const categories = ["Sports"];
          await Event.create({ name, start, end, location, description, visibility, organizer, categories });
        } catch (err) {
          expect(err).toBeDefined();
        }
      });

      describe("test location is required", () => {
        it("test location is null", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = null;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await Event.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err).toBeDefined();
          }
        });
    
        it("test location is undefined", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = undefined;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await Event.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err).toBeDefined();
          }
        });
    
        it("test location is empty", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = "";
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await Event.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err).toBeDefined();
          }
        });
      });
    
        it("test location is invalid", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.lorem.words(3);
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await Event.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err).toBeDefined();
          }
        });
    });

    describe("test description is required", () => {
      it("test description is null", async () => {
        try {
          const name = faker.lorem.words(3);
          const start = faker.date.future(1);
          const end = faker.date.soon(1, start);
          const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
          const description = null;
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const categories = ["Sports"];
          await Event.create({ name, start, end, location, description, visibility, organizer, categories });
        } catch (err) {
          expect(err).toBeDefined();
        }
      });
  
      it("test description is undefined", async () => {
        try {
          const name = faker.lorem.words(3);
          const start = faker.date.future(1);
          const end = faker.date.soon(1, start);
          const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
          const description = undefined;
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const categories = ["Sports"];
          await Event.create({ name, start, end, location, description, visibility, organizer, categories });
        } catch (err) {
          expect(err).toBeDefined();
        }
      });
  
      it("test description is empty", async () => {
        try {
          const name = faker.lorem.words(3);
          const start = faker.date.future(1);
          const end = faker.date.soon(1, start);
          const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
          const description = "";
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const categories = ["Sports"];
          await Event.create({ name, start, end, location, description, visibility, organizer, categories });
        } catch (err) {
          expect(err).toBeDefined();
        }
      });
    
  
      it("test description is invalid", async () => {
        try {
          const name = faker.lorem.words(3);
          const start = faker.date.future(1);
          const end = faker.date.soon(1, start);
          const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
          const description = mongoose.Types.ObjectId();
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const categories = ["Sports"];
          await Event.create({ name, start, end, location, description, visibility, organizer, categories });
        } catch (err) {
          expect(err).toBeDefined();
        }
      });
    });

      describe("test visibility is required", () => {
        it("test visibility is null", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = null;
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await Event.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err).toBeDefined();
          }
        });
    
        it("test visibility is undefined", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = undefined;
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await Event.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err).toBeDefined();
          }
        });
    
        it("test visibility is empty", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await Event.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err).toBeDefined();
          }
        });
      
    
        it("test visibility is invalid", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = faker.lorem.words(3);
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await Event.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err).toBeDefined();
          }
        });
      });

        describe("test organizer is required", () => {
          it("test organizer is null", async () => {
            try {
              const name = faker.lorem.words(3);
              const start = faker.date.future(1);
              const end = faker.date.soon(1, start);
              const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
              const description = faker.lorem.paragraph();
              const visibility = "private";
              const organizer = null;
              const categories = ["Sports"];
              await Event.create({ name, start, end, location, description, visibility, organizer, categories });
            } catch (err) {
              expect(err).toBeDefined();
            }
          });
      
          it("test organizer is undefined", async () => {
            try {
              const name = faker.lorem.words(3);
              const start = faker.date.future(1);
              const end = faker.date.soon(1, start);
              const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
              const description = faker.lorem.paragraph();
              const visibility = "private";
              const organizer = undefined;
              const categories = ["Sports"];
              await Event.create({ name, start, end, location, description, visibility, organizer, categories });
            } catch (err) {
              expect(err).toBeDefined();
            }
          });
      
          it("test organizer is empty", async () => {
            try {
              const name = faker.lorem.words(3);
              const start = faker.date.future(1);
              const end = faker.date.soon(1, start);
              const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
              const description = faker.lorem.paragraph();
              const visibility = "private";
              const organizer = "";
              const categories = ["Sports"];
              await Event.create({ name, start, end, location, description, visibility, organizer, categories });
            } catch (err) {
              expect(err).toBeDefined();
            }
          });
        
      
          it("test organizer is invalid", async () => {
            try {
              const name = faker.lorem.words(3);
              const start = faker.date.future(1);
              const end = faker.date.soon(1, start);
              const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
              const description = faker.lorem.paragraph();
              const visibility = "private";
              const organizer = faker.lorem.words(3);
              const categories = ["Sports"];
              await Event.create({ name, start, end, location, description, visibility, organizer, categories });
            } catch (err) {
              expect(err).toBeDefined();
            }
          });
        });


  afterAll(async () => {
    await Event.deleteMany({});
  });
});
