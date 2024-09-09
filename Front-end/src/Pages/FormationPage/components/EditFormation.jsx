import React, { useState, useEffect } from "react";
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

    // Validation schema
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

// Tag input component
const TagInput = ({ tags, setTags, inputValue, setInputValue }) => {
  const handleAddTag = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div>
      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag"
          className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
        />
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
              <X className="w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// EditFormation component
const EditFormation = ({ allFormations, onSubmit }) => {
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState("");
  
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
        tags: [],
      },
    });
  
    const handleFormationSelect = (formationId) => {
      const formation = allFormations.find(f => f.title === formationId);
      if (formation) {
        setSelectedFormation(formation);
        form.reset({
          fullName: formation.title,
          type: formation.type,
          description: formation.description,
          dateRange: {
            from: new Date(formation.startDate),
            to: new Date(formation.endDate),
          },
        });
        setTags(formation.tags || []);
      }
    };
  
    return (
      <div className="z-1 flex flex-col w-50 items-center min-h-screen">
        <ToastContainer />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              onSubmit(data, tags, selectedFormation?._id )
            })}
            className="w-full max-w-lg space-y-6 bg-white p-8"
          >
            <FormField
              control={form.control} 
              name="selectedFormation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Select Formation</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleFormationSelect(value);
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="ring-0 ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent">
                        <SelectValue placeholder="Select formation to edit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-black">Formations</SelectLabel>
                        {allFormations.map((formation) => (
                          <SelectItem key={formation._id} value={formation.title}>
                            {formation.title}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
  
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
                  <FormLabel className="text-black">Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="ring-0 ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-black">Types</SelectLabel>
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
                  <FormLabel className="text-black">Description</FormLabel>
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
                  <FormLabel className="text-black">Date Range</FormLabel>
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
                  <FormLabel className="text-black">Tags</FormLabel>
                  <FormControl>
                    <TagInput
                      tags={tags}
                      setTags={setTags}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <Button type="submit" className="w-full bg-orange-500 text-white hover:bg-orange-500 hover:text-white transition-colors duration-500 ring-0 ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent">
              Update
            </Button>
          </form>
        </Form>
      </div>
    );
  };

export default EditFormation;
