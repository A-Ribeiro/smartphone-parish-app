using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace editor_informacao_paroquia
{
    public partial class Form1 : Form
    {
        json.ContentList content = new json.ContentList();

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            content = json.readFromFile("content/paroquia.json");

            listBox1.Items.Clear();
            foreach (json.Content item in content.list)
                listBox1.Items.Add(item.title );
        }

        private void listBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (listBox1.SelectedIndex >= 0)
            {
                json.Content item = content.list[listBox1.SelectedIndex];

                tb_titulo.Text = item.title;
                tb_content.Text = item.html;
                checkBox1.Checked = item.builtin;
            }
            else
            {

                tb_titulo.Text = "";
                tb_content.Text = "";
                checkBox1.Checked = true;

            }
        }

        private void bt_nova_Click(object sender, EventArgs e)
        {
            listBox1.SelectedIndex = -1;

            tb_titulo.Text = "";
            tb_content.Text = "";
            checkBox1.Checked = true;
        }

        private void bt_salvar_Click(object sender, EventArgs e)
        {
            if (listBox1.SelectedIndex >= 0)
            {
                int selectedIndex = listBox1.SelectedIndex;
                json.Content item = content.list[listBox1.SelectedIndex];
                
                item.title = tb_titulo.Text.Trim(new char[] { ' ', '\r', '\n', '\t' });
                item.html = tb_content.Text.Trim(new char[] { ' ', '\r', '\n', '\t' });
                item.builtin = checkBox1.Checked;
                
                json.writeToFile("content/paroquia.json", content);

                listBox1.Items.Clear();
                foreach (json.Content it in content.list)
                    listBox1.Items.Add(it.title);

                listBox1.SelectedIndex = content.list.IndexOf(item);

                MessageBox.Show("Atualizado!!!");
                return;
            }

            if (tb_titulo.Text.Trim(new char[] { ' ', '\r', '\n', '\t' }).Length > 0)
            {

                json.Content item = new json.Content();

                item.title = tb_titulo.Text.Trim(new char[] { ' ', '\r', '\n', '\t' });
                item.html = tb_content.Text.Trim(new char[] { ' ', '\r', '\n', '\t' });
                item.builtin = checkBox1.Checked;

                content.list.Add(item);

                json.writeToFile("content/paroquia.json", content);


                listBox1.Items.Clear();
                foreach (json.Content it in content.list)
                    listBox1.Items.Add(it.title);

                listBox1.SelectedIndex = content.list.IndexOf(item);

                listBox1_SelectedIndexChanged(null, null);


                MessageBox.Show("Adicionado: " + item.title);

            }
            else
            {
                MessageBox.Show("É necessário preencher os campos\npara criar uma nova entrada.");
            }
        }

        private void bt_remove_Click(object sender, EventArgs e)
        {
            if (listBox1.SelectedIndex >= 0)
            {
                int selectedIndex = listBox1.SelectedIndex;

                content.list.RemoveAt(selectedIndex);

                json.writeToFile("content/paroquia.json", content);

                listBox1.Items.Clear();
                foreach (json.Content item in content.list)
                    listBox1.Items.Add(item.title);

                listBox1.SelectedIndex = -1;
                if (selectedIndex < content.list.Count)
                    listBox1.SelectedIndex = selectedIndex;

                listBox1_SelectedIndexChanged(null,null);

            }
        }

        private void bt_baixo_Click(object sender, EventArgs e)
        {
            if (listBox1.SelectedIndex >= 0)
            {
                json.Content item = content.list[listBox1.SelectedIndex];

                if (listBox1.SelectedIndex+1 < content.list.Count)
                {
                    content.list[listBox1.SelectedIndex] = content.list[listBox1.SelectedIndex + 1];
                    content.list[listBox1.SelectedIndex + 1] = item;
                }

                listBox1.Items.Clear();
                foreach (json.Content it in content.list)
                    listBox1.Items.Add(it.title);

                listBox1.SelectedIndex = content.list.IndexOf(item);

                json.writeToFile("content/paroquia.json", content);

            }


        }

        private void bt_cima_Click(object sender, EventArgs e)
        {
            if (listBox1.SelectedIndex >= 0)
            {
                json.Content item = content.list[listBox1.SelectedIndex];

                if (listBox1.SelectedIndex - 1 >= 0)
                {
                    content.list[listBox1.SelectedIndex] = content.list[listBox1.SelectedIndex - 1];
                    content.list[listBox1.SelectedIndex - 1] = item;
                }

                listBox1.Items.Clear();
                foreach (json.Content it in content.list)
                    listBox1.Items.Add(it.title);

                listBox1.SelectedIndex = content.list.IndexOf(item);

                json.writeToFile("content/paroquia.json", content);
            }
        }
    }
}
