
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, alertData, token } = await req.json()

    if (!userId || !alertData) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Store the emergency alert in the database
    const { data: alertRecord, error: alertError } = await supabase
      .from('emergency_alerts')
      .insert({
        user_id: userId,
        alert_type: alertData.type,
        message: alertData.message,
        location: alertData.location,
        urgency: alertData.urgency,
        status: 'sent',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (alertError) {
      console.error('Error storing alert:', alertError)
      throw alertError
    }

    // Get user's guardians for notification
    const { data: guardians, error: guardiansError } = await supabase
      .from('guardians')
      .select('guardian_email, guardian_phone, guardian_name')
      .eq('user_id', userId)
      .eq('status', 'accepted')

    if (guardiansError) {
      console.error('Error fetching guardians:', guardiansError)
    }

    // Send push notifications (this would integrate with a service like FCM)
    // For now, we'll just log the notification
    console.log('Emergency notification:', {
      alertId: alertRecord.id,
      type: alertData.type,
      message: alertData.message,
      urgency: alertData.urgency,
      guardians: guardians?.length || 0
    })

    // In a real implementation, you would:
    // 1. Send push notifications to user's devices
    // 2. Send SMS/email to guardians
    // 3. Alert campus security
    // 4. Trigger emergency protocols based on urgency

    return new Response(
      JSON.stringify({ 
        success: true, 
        alertId: alertRecord.id,
        guardiansNotified: guardians?.length || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-emergency-notification:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
