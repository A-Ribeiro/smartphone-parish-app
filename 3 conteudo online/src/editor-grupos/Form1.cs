using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace editor_grupos
{
    public partial class Form1 : Form
    {

        GroupJSON.GroupList groupJSON = new GroupJSON.GroupList();

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            groupJSON = GroupJSON.readFromFile("content/group.json");

            comboBox1.Items.Clear();
            foreach (GroupJSON.Group grp in groupJSON.group_list)
                comboBox1.Items.Add(grp.parish + ": " + grp.name);

            tb_titulo_pagina.Text = "";
            tb_noticia.Text = "";

            if (groupJSON.group_list.Count>0)
            {
                comboBox1.SelectedIndex = 0;

                bt_new.Enabled = true;
                bt_remove.Enabled = true;
                bt_save.Enabled = true;
            } else
            {
                bt_new.Enabled = false;
                bt_remove.Enabled = false;
                bt_save.Enabled = true;
            }
            
        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (comboBox1.SelectedIndex >= 0) {
                GroupJSON.Group group = groupJSON.group_list[comboBox1.SelectedIndex];

                tb_titulo_pagina.Text = group.name;
                tb_noticia.Text = group.text;
                tb_parish.Text = group.parish;

                bt_new.Enabled = true;
                bt_remove.Enabled = true;
                bt_save.Enabled = true;

            } else
            {
                tb_titulo_pagina.Text = "";
                tb_noticia.Text = "";

                bt_new.Enabled = false;
                bt_remove.Enabled = false;
                bt_save.Enabled = true;

            }


        }

        private void bt_new_Click(object sender, EventArgs e)
        {

            comboBox1.SelectedIndex = -1;

            tb_titulo_pagina.Text = "";
            tb_noticia.Text = "";

            bt_new.Enabled = false;
            bt_remove.Enabled = false;
            bt_save.Enabled = true;

        }

        private void bt_save_Click(object sender, EventArgs e)
        {
            if (comboBox1.SelectedIndex >= 0)
            {
                int selectedIndex = comboBox1.SelectedIndex;
                GroupJSON.Group group = groupJSON.group_list[comboBox1.SelectedIndex];

                group.name = tb_titulo_pagina.Text.Trim(new char[] {' ','\r','\n','\t' });
                group.text = tb_noticia.Text.Trim(new char[] { ' ', '\r', '\n', '\t' });
                group.parish = tb_parish.Text.Trim(new char[] { ' ', '\r', '\n', '\t' });

                groupJSON.Sort();
                selectedIndex = groupJSON.group_list.IndexOf(group);
                
                GroupJSON.writeToFile("content/group.json", groupJSON);

                comboBox1.Items.Clear();
                foreach (GroupJSON.Group grp in groupJSON.group_list)
                    comboBox1.Items.Add(grp.parish + ": " + grp.name);

                comboBox1.SelectedIndex = selectedIndex;


                MessageBox.Show("Grupo atualizado!!!");
                return;
            }

            if (tb_titulo_pagina.Text.Length > 0)
            {

                GroupJSON.Group group = new GroupJSON.Group(); //groupJSON.news_list[comboBox1.SelectedIndex];

                group.name = tb_titulo_pagina.Text.Trim(new char[] { ' ', '\r', '\n', '\t' });
                group.text = tb_noticia.Text.Trim(new char[] { ' ', '\r', '\n', '\t' });
                group.parish = tb_parish.Text.Trim(new char[] { ' ', '\r', '\n', '\t' });

                groupJSON.group_list.Add(group);

                groupJSON.Sort();
                int selectedIndex = groupJSON.group_list.IndexOf(group);

                GroupJSON.writeToFile("content/group.json", groupJSON);

                comboBox1.Items.Clear();
                foreach (GroupJSON.Group grp in groupJSON.group_list)
                    comboBox1.Items.Add(grp.parish + ": " + grp.name);

                comboBox1.SelectedIndex = selectedIndex;

                bt_new.Enabled = true;
                bt_remove.Enabled = true;
                bt_save.Enabled = true;

                MessageBox.Show("Grupo adicionado: " + group.name);

            } else
            {
                MessageBox.Show("É necessário preencher os campos\npara criar uma notícia nova.");
            }
        }

        private void bt_remove_Click(object sender, EventArgs e)
        {
            if (comboBox1.SelectedIndex >= 0)
            {
                int selectedIndex = comboBox1.SelectedIndex;
                string groupTitle = groupJSON.group_list[comboBox1.SelectedIndex].name;

                groupJSON.group_list.RemoveAt(comboBox1.SelectedIndex);

                GroupJSON.writeToFile("content/group.json", groupJSON);

                comboBox1.Items.Clear();
                foreach (GroupJSON.Group grp in groupJSON.group_list)
                    comboBox1.Items.Add(grp.parish + ": " + grp.name);

                if (selectedIndex < groupJSON.group_list.Count)
                {
                    comboBox1.SelectedIndex = selectedIndex;

                    GroupJSON.Group group = groupJSON.group_list[comboBox1.SelectedIndex];

                    tb_titulo_pagina.Text = group.name;
                    tb_noticia.Text = group.text;
                    tb_parish.Text = group.parish;

                    bt_new.Enabled = true;
                    bt_remove.Enabled = true;
                    bt_save.Enabled = true;

                } else
                {
                    bt_new.Enabled = false;
                    bt_remove.Enabled = false;
                    bt_save.Enabled = true;
                }

                MessageBox.Show("Grupo removido: " + groupTitle);
            }
        }
    }
}

