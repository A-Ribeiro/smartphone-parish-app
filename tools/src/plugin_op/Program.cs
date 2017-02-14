using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace plugin_op
{
    class Program
    {
        static void Main(string[] args)
        {

            if (args.Length < 2)
                return;

            string[] fileContents = File.ReadAllLines("config.txt");

            json.Plugin plugin = new json.Plugin();
            plugin.category = fileContents[0];
            plugin.name = fileContents[1];
            plugin.entry = "";
            for (int i = 2; i < fileContents.Length; i++)
                plugin.entry += fileContents[i];

            
            json.Plugins plugins = json.readFromFile(args[1]);

            if (args[0].Equals("add"))
                plugins.InsertOrUpdate(plugin);

            if (args[0].Equals("remove"))
                plugins.Remove(plugin);

            json.writeToFile(args[1], plugins);

        }
    }
}
