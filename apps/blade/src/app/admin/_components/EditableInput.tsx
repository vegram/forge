import { cn } from "@forge/ui";
import { Input } from "@forge/ui/input";
import { Pencil, Check } from "lucide-react";
import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@forge/ui/select";
import { FormControl } from "@forge/ui/form";

export default function EditableInput(
    { placeholder = "", type = "text", items = [""], ...field }:
    { placeholder?: string, type?: string, items?: string[]}
) {
    const [toggle, setToggle] = useState<boolean>(true);

    return (
        <div
        className={cn("flex flex-row relative",
            "w-full items-center justify-end")}
        >
            {type == "text" || type == "date" ?
                <Input 
                    type={type}
                    placeholder={placeholder} 
                    {...field} 
                    disabled={toggle}
                />
                :
                <Select
                    {...field}
                >
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {items.map((item) => (
                        <SelectItem key={item} value={item}>
                        {item}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            }
            <button
                type="submit"
                className={cn("absolute", 
                    (type != "text" && !toggle)? "right-10" : "right-4")}
                onClick={(e) => {
                    e.preventDefault();
                    setToggle(!toggle);
                }}
            >
                {toggle && <Pencil size={16} />}
                {!toggle && <Check size={18} />}
            </button>
        </div>
    );
}