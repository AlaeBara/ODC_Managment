import React, { useState } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formationSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }),
  type: z.string().min(1, { message: "Type is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  dateRange: z.object({
    from: z.date({ required_error: "Start date is required." }),
    to: z.date({ required_error: "End date is required." }),
  }),
  tags: z.array(z.string()).optional(),
});

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a tag"
          className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
        />
        <Button type="button" onClick={handleAddTag }>Add</Button>
      </div>
      <div className="flex flex-wrap mt-2 gap-2 max-w-full">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 bg-gray-200 p-1 pl-3 rounded"
          >
            <span>{tag}</span>
            <button 
              type="button"
              onClick={() => handleRemoveTag(index)}
              
              className="text-black-500 focus:outline-none"
            >
              <X  className="w-5"/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Forum = () => {
  const form = useForm({
    resolver: zodResolver(formationSchema),
    defaultValues: {
      fullName: "",
      type: "",
      description: "",
      dateRange: {
        from: new Date(),
        to: addDays(new Date(), 7),
      },
      tags: []
    },
  });

  const [tags, setTags] = useState([]);

  const onSubmit = async (data) => {
    const formattedData = {
      title: data.fullName,
      type: data.type,
      description: data.description,
      dateRange: {
        startDate: format(data.dateRange.from, "yyyy-MM-dd"),
        endDate: format(data.dateRange.to, "yyyy-MM-dd"),
      },
    };
    alert(
      `Full Name: ${formattedData.title}\nType: ${formattedData.type}\nDescription: ${formattedData.description}\nDate Range: ${formattedData.dateRange.startDate} to ${formattedData.dateRange.endDate}`
    );

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/api/courses/Addformation`,
        {
          title: formattedData.title,
          description: data.password,
          startDate: formattedData.dateRange.startDate,
          endDate: formattedData.dateRange.endDate,
          type: formattedData.type,
          tags: tags,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Formation added successfully!");
      }
      else{
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.response.data.error);
        console.error(error);
      }
    }
  
    
  };

  return (
    <div className="z-1 flex flex-col w-50 items-center min-h-screen">
      <ToastContainer />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-lg space-y-6 bg-white p-8 "
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Full Name"
                    {...field}
                    className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="ring-0 ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel  className="text-black">Types</SelectLabel>
                      <SelectItem value="type1">Type 1</SelectItem>
                      <SelectItem value="type2">Type 2</SelectItem>
                      <SelectItem value="type3">Type 3</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel  className="text-black">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel  className="text-black">Date Range</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, "LLL dd, y")} -{" "}
                              {format(field.value.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(field.value.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel  className="text-black">Tags</FormLabel>
                <FormControl>
                  <TagInput tags={tags} setTags={setTags} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Forum;
