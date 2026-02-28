import { supabase } from './supabase.js';

export async function getTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function addTodo(task) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('todos')
    .insert([{ task, user_id: user.id }])
    .select()
    .maybeSingle();

  return { data, error };
}

export async function deleteTodo(id) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  return { error };
}

export async function toggleTodo(id, completed) {
  const { data, error } = await supabase
    .from('todos')
    .update({ completed })
    .eq('id', id)
    .select()
    .maybeSingle();

  return { data, error };
}
