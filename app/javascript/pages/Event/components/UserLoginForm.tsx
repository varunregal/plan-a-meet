import {
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonWithLoader from "./ButtonWithLoader";

function UserLoginForm({ form, isLoading }: { form: any; isLoading: boolean }) {
  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Name</FormLabel>
            <FormControl>
              <Input
                autoComplete="off"
                placeholder="Enter your name"
                {...field}
                className="w-[300px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password (optional)</FormLabel>
            <FormControl>
              <Input
                type="password"
                autoComplete="off"
                placeholder="Enter your password"
                {...field}
                className="w-[300px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <ButtonWithLoader isLoading={isLoading}>Submit</ButtonWithLoader>
    </div>
  );
}

export default UserLoginForm;
