/**
 * Booking Form Component
 * 
 * A dental appointment booking form with validation.
 * Demonstrates the design system in action.
 */

'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form'
import { Checkbox } from '@/src/components/ui/checkbox'

// Form validation schema
const bookingFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  phone: z.string().min(10, {
    message: 'Please enter a valid phone number.',
  }),
  service: z.string({
    message: 'Please select a service.',
  }),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
})

type BookingFormValues = z.infer<typeof bookingFormSchema>

// Default values
const defaultValues: Partial<BookingFormValues> = {
  name: '',
  phone: '',
  message: '',
  agreeToTerms: false,
}

interface BookingFormProps {
  onSuccess?: () => void
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
  })

  async function onSubmit(data: BookingFormValues) {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSuccess(true)
    
    // Reset form after success
    setTimeout(() => {
      form.reset()
      setIsSuccess(false)
      onSuccess?.()
    }, 3000)
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl bg-success-50 border-2 border-success-500 p-8 text-center space-y-4">
        <div className="text-5xl">✓</div>
        <h3 className="text-2xl font-bold text-success-600">
          Booking Request Sent!
        </h3>
        <p className="text-success-600">
          We'll contact you shortly to confirm your appointment.
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Service Select */}
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general-checkup">
                    General Checkup
                  </SelectItem>
                  <SelectItem value="dental-implants">
                    Dental Implants
                  </SelectItem>
                  <SelectItem value="teeth-whitening">
                    Teeth Whitening
                  </SelectItem>
                  <SelectItem value="orthodontics">Orthodontics</SelectItem>
                  <SelectItem value="root-canal">Root Canal</SelectItem>
                  <SelectItem value="cosmetic-dentistry">
                    Cosmetic Dentistry
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Preferred Date */}
        <FormField
          control={form.control}
          name="preferredDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                We'll do our best to accommodate your preferred date.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message Field */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your dental concerns or any questions you have..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional: Share any specific concerns or questions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Terms Checkbox */}
        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border p-4 bg-background-muted">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the terms and conditions *
                </FormLabel>
                <FormDescription>
                  By submitting this form, you agree to our privacy policy and
                  terms of service.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Book Appointment'
          )}
        </Button>
      </form>
    </Form>
  )
}
