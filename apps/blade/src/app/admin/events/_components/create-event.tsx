"use client";

import { useState } from "react";
import { format } from "date-fns";
<<<<<<< HEAD
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { z } from "zod";

import { EVENT_TAGS } from "@forge/consts/knight-hacks";
import { InsertEventSchema } from "@forge/db/schemas/knight-hacks";
=======
import { CalendarIcon, Plus } from "lucide-react";

import { EVENT_TAGS } from "@forge/consts/knight-hacks";
>>>>>>> 51e3f52 (creates event dialog popup for new events)
import { cn } from "@forge/ui";
import { Button } from "@forge/ui/button";
import { Calendar } from "@forge/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@forge/ui/dialog";
<<<<<<< HEAD
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@forge/ui/form";
=======
>>>>>>> 51e3f52 (creates event dialog popup for new events)
import { Input } from "@forge/ui/input";
import { Label } from "@forge/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@forge/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@forge/ui/select";
import { Textarea } from "@forge/ui/textarea";
<<<<<<< HEAD
import { toast } from "@forge/ui/toast";

import { api } from "~/trpc/react";

// 12-hour-based hours (1–12), displayed as "01", "02", ..., "12"
=======

// 12-hour-based hours (1–12)
>>>>>>> 51e3f52 (creates event dialog popup for new events)
const hours = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, "0"),
);

// Minutes (00, 05, 10, ... , 55)
const minutes = Array.from({ length: 12 }, (_, i) =>
  (i * 5).toString().padStart(2, "0"),
);

<<<<<<< HEAD
const amPmOptions = ["AM", "PM"] as const;

export function CreateEventButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const utils = api.useUtils();

  // TRPC mutation
  const createEvent = api.event.createEvent.useMutation({
    onSuccess() {
      toast.success("Event created successfully!");

      // Close dialog & reset form
      setIsOpen(false);
      form.reset();
    },
    onError(opts) {
      toast.error(opts.message);
    },
    async onSettled() {
      await utils.event.invalidate();
      setIsLoading(false);
    },
  });

  // Initialize form with Zod schema
  const FormSchema = InsertEventSchema.omit({
    start_datetime: true,
    end_datetime: true,
    discordId: true,
    googleId: true,
  }).extend({
    date: z.string(),
    startHour: z.string(),
    startMinute: z.string(),
    startAmPm: z.enum(["AM", "PM"]),
    endHour: z.string(),
    endMinute: z.string(),
    endAmPm: z.enum(["AM", "PM"]),
  });

  const form = useForm({
    schema: FormSchema,
    defaultValues: {
      name: "",
      description: "",
      location: "",
      tag: EVENT_TAGS[0],
      date: "",
      startHour: "",
      startMinute: "",
      startAmPm: "PM",
      endHour: "",
      endMinute: "",
      endAmPm: "PM",
    },
  });
=======
const amPmOptions = ["AM", "PM"];

export function CreateEventButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState<Date>();
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [amPm, setAmPm] = useState("PM");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation: ensure all fields have values
    if (
      !name ||
      !tag ||
      !date ||
      !hour ||
      !minute ||
      !amPm ||
      !location ||
      !description
    ) {
      alert("All fields are required.");
      return;
    }

    // Convert the chosen hour to 24-hour format
    if (date) {
      let hour24 = parseInt(hour, 10) || 0;

      // 12-hour → 24-hour conversion
      // 12 AM is 0 hours; 12 PM is 12 hours
      if (amPm === "PM" && hour24 < 12) {
        hour24 += 12;
      }
      if (amPm === "AM" && hour24 === 12) {
        hour24 = 0;
      }

      date.setHours(hour24, parseInt(minute, 10) || 0);
    }

    console.log({
      name,
      tag,
      date,
      location,
      description,
    });

    setIsOpen(false);
    // Reset form
    setName("");
    setTag("");
    setDate(undefined);
    setHour("");
    setMinute("");
    setAmPm("AM");
    setLocation("");
    setDescription("");
  };
>>>>>>> 51e3f52 (creates event dialog popup for new events)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </DialogTrigger>
<<<<<<< HEAD

      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              setIsLoading(true);
              // Convert start date + hour/minute/amPm to a valid Date object
              const finalStartDate = new Date(values.date);
              let hour24 = parseInt(values.startHour, 10) || 0;
              if (values.startAmPm === "PM" && hour24 < 12) {
                hour24 += 12;
              }
              if (values.startAmPm === "AM" && hour24 === 12) {
                hour24 = 0;
              }
              finalStartDate.setHours(
                hour24,
                parseInt(values.startMinute, 10) || 0,
              );

              // Convert end date + hour/minute/amPm to a valid Date object
              const finalEndDate = new Date(values.date);
              let endHour24 = parseInt(values.endHour, 10) || 0;
              if (values.endAmPm === "PM" && endHour24 < 12) {
                endHour24 += 12;
              }
              if (values.endAmPm === "AM" && endHour24 === 12) {
                endHour24 = 0;
              }
              finalEndDate.setHours(
                endHour24,
                parseInt(values.endMinute, 10) || 0,
              );

              // Ensure the end date is after the start date
              if (finalEndDate <= finalStartDate) {
                toast.error("End date must be after the start date.");
                setIsLoading(false);
                return;
              }

              // Pass the final date/time to TRPC
              createEvent.mutate({
                name: values.name,
                description: values.description,
                location: values.location,
                tag: values.tag,
                start_datetime: finalStartDate,
                end_datetime: finalEndDate,
              });
            })}
            noValidate
          >
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Fill in the details for the new event. Click create when you're
                done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel htmlFor="name" className="text-right">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="Enter event name"
                          {...field}
                          className="col-span-3"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tag (enum from EVENT_TAGS) */}
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel htmlFor="tag" className="text-right">
                        Tag
                      </FormLabel>
                      <FormControl>
                        <Select
                          // Use defaultValue if the field already has a value
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select a tag" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EVENT_TAGS.map((tagOption) => (
                              <SelectItem key={tagOption} value={tagOption}>
                                {tagOption}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date (Calendar popover) */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "col-span-3 justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(new Date(field.value), "PPP")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              // If field.value is an empty string, we pass undefined to Calendar
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(selectedDate) => {
                                // Make sure the selected date is not null
                                if (!selectedDate) {
                                  toast.error("Please select a date.");
                                  return;
                                }

                                // Make sure the selected date is in the future
                                if (selectedDate < new Date()) {
                                  toast.error("Please select a future date.");
                                  return;
                                }

                                // Convert the chosen date to an ISO string
                                field.onChange(selectedDate.toISOString());
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Time (Hour, Minute, AM/PM) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Start</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  {/* Hour */}
                  <FormField
                    control={form.control}
                    name="startHour"
                    render={({ field }) => (
                      <FormItem className="mb-0">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="HH" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hours.map((h) => (
                                <SelectItem key={h} value={h}>
                                  {h}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span>:</span>

                  {/* Minute */}
                  <FormField
                    control={form.control}
                    name="startMinute"
                    render={({ field }) => (
                      <FormItem className="mb-0">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="MM" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {minutes.map((m) => (
                                <SelectItem key={m} value={m}>
                                  {m}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* AM/PM */}
                  <FormField
                    control={form.control}
                    name="startAmPm"
                    render={({ field }) => (
                      <FormItem className="mb-0">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="AM/PM" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {amPmOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* End Time (Hour, Minute, AM/PM) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">End</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  {/* Hour */}
                  <FormField
                    control={form.control}
                    name="endHour"
                    render={({ field }) => (
                      <FormItem className="mb-0">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="HH" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hours.map((h) => (
                                <SelectItem key={h} value={h}>
                                  {h}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span>:</span>

                  {/* Minute */}
                  <FormField
                    control={form.control}
                    name="endMinute"
                    render={({ field }) => (
                      <FormItem className="mb-0">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="MM" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {minutes.map((m) => (
                                <SelectItem key={m} value={m}>
                                  {m}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* AM/PM */}
                  <FormField
                    control={form.control}
                    name="endAmPm"
                    render={({ field }) => (
                      <FormItem className="mb-0">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="AM/PM" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {amPmOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel htmlFor="location" className="text-right">
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="location"
                          placeholder="Enter location"
                          {...field}
                          className="col-span-3"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel htmlFor="description" className="text-right">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          id="description"
                          placeholder="Enter description..."
                          rows={4}
                          {...field}
                          className="col-span-3"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create Event"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
=======
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the details for the new event. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* Tag */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag" className="text-right">
                Tag
              </Label>
              <Select value={tag} onValueChange={setTag}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(EVENT_TAGS) &&
                    EVENT_TAGS.map((tag: string) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Time</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>:</span>
                <Select value={minute} onValueChange={setMinute}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={amPm} onValueChange={setAmPm}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    {amPmOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                required
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Event</Button>
          </DialogFooter>
        </form>
>>>>>>> 51e3f52 (creates event dialog popup for new events)
      </DialogContent>
    </Dialog>
  );
}
